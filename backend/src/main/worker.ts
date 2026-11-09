import 'dotenv/config';
import amqp from 'amqplib';
import type { ConsumeMessage } from 'amqplib';
import { prisma } from '../infra/Repositories/prisma/client';
import { ReviewReportRepoPrisma } from '../infra/Repositories/prisma/Repositories/review-report-repo.prisma';
import { InvalidMessageError, ReviewReportProcessUsecase } from '../core/useCases/reviewReport/review-report-process.usecase';
import { assertTopology, rabbitUrl, TOPOLOGY } from '../infra/messaging/rabbitmq-topology';
import { reportThreshold } from '../infra/config/moderation-config';

/**
 * WORKER DE MODERAÇÃO (consumidor do RabbitMQ)
 *
 * Consome "moderation.review-reported", conta as denúncias e oculta a análise
 * quando atinge REPORT_THRESHOLD. Roda como processo separado da API:
 *   npm run worker        (produção, após build)
 *   npm run worker:dev    (desenvolvimento, com ts-node)
 *
 * Tratamento de falhas:
 *  - Mensagem inválida → rejeitada sem reenfileirar → vai para a DLQ.
 *  - Erro inesperado (ex.: banco fora) → 1ª vez volta para a fila após RETRY_DELAY_MS;
 *    se falhar de novo → DLQ. A denúncia continua PENDING no banco e pode ser
 *    republicada pelo backoffice (POST /admin/moderation/reports/republish).
 *  - Conexão com o broker caiu → o worker reconecta sozinho a cada 5s; mensagens
 *    sem ack voltam para a fila e são entregues de novo (processamento idempotente).
 */
const RETRY_DELAY_MS = Number(process.env.WORKER_RETRY_DELAY_MS ?? 5000);
const CONNECT_RETRY_MS = 5000;

const usecase = new ReviewReportProcessUsecase(new ReviewReportRepoPrisma(prisma), reportThreshold());

async function connectWithRetry() {
    for (;;) {
        try {
            return await amqp.connect(rabbitUrl(), { timeout: 5000 });
        } catch (err: any) {
            console.error(`[worker] RabbitMQ indisponível (${err.message}); nova tentativa em ${CONNECT_RETRY_MS / 1000}s`);
            await new Promise((r) => setTimeout(r, CONNECT_RETRY_MS));
        }
    }
}

let current: Awaited<ReturnType<typeof amqp.connect>> | null = null;
let shuttingDown = false;

async function start() {
    const connection = await connectWithRetry();
    current = connection;
    connection.on('close', () => {
        current = null;
        if (shuttingDown) return;
        // A mensagem em processamento sem ack volta para a fila; nada se perde.
        console.error(`[worker] conexão com o RabbitMQ encerrada; reconectando em ${CONNECT_RETRY_MS / 1000}s`);
        setTimeout(() => start().catch((err) => console.error('[worker] falha ao reconectar:', err.message)), CONNECT_RETRY_MS);
    });
    connection.on('error', (err) => console.error('[worker] erro na conexão:', err.message));

    const channel = await connection.createChannel();
    await assertTopology(channel);
    await channel.prefetch(1); // processa uma denúncia por vez

    const queue = TOPOLOGY.reviewReported.queue;
    console.log(`[worker] aguardando mensagens em "${queue}" (limite para ocultar: ${reportThreshold()} denúncias)`);

    await channel.consume(queue, async (msg: ConsumeMessage | null) => {
        if (!msg) return; // consumidor cancelado pelo broker
        const id = msg.properties.messageId ?? '?';
        try {
            await usecase.execute(msg.content.toString('utf-8'));
            channel.ack(msg);
        } catch (err: any) {
            if (err instanceof InvalidMessageError) {
                console.error(`[worker] mensagem ${id} inválida (${err.message}) → DLQ`);
                channel.nack(msg, false, false);
            } else if (!msg.fields.redelivered) {
                console.error(`[worker] erro ao processar ${id} (${err.message}); tentando de novo em ${RETRY_DELAY_MS}ms`);
                setTimeout(() => channel.nack(msg, false, true), RETRY_DELAY_MS);
            } else {
                console.error(`[worker] erro ao reprocessar ${id} (${err.message}) → DLQ`);
                channel.nack(msg, false, false);
            }
        }
    });
}

async function main() {
    await prisma.$connect();
    await start();

    const shutdown = async () => {
        console.log('[worker] encerrando...');
        shuttingDown = true;
        await current?.close().catch(() => undefined);
        await prisma.$disconnect();
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

main().catch((err) => {
    console.error('[worker] falha ao iniciar:', err);
    process.exit(1);
});
