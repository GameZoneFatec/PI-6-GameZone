import amqp from 'amqplib';
import type { ChannelModel, ConfirmChannel } from 'amqplib';
import { IMessagePublisher, PublishOptions } from '../../adapters/IMessagePublisher';
import { assertTopology, rabbitUrl, TOPOLOGY } from './rabbitmq-topology';

/**
 * Publicador com "publisher confirms": publish() só resolve depois que o broker
 * confirma que recebeu a mensagem. Se o RabbitMQ estiver fora do ar, publish()
 * rejeita e quem chamou decide o que fazer (a denúncia continua PENDING no banco).
 *
 * A conexão é aberta sob demanda e reaberta na próxima publicação se cair.
 */
export class RabbitMQPublisher implements IMessagePublisher {
    private connection: ChannelModel | null = null;
    private channel: ConfirmChannel | null = null;
    private connecting: Promise<ConfirmChannel> | null = null;

    constructor(
        private url: string = rabbitUrl(),
        private connectTimeoutMs = 3000,
    ) {}

    async publish(routingKey: string, message: object, options: PublishOptions): Promise<void> {
        const channel = await this.getChannel();
        const body = Buffer.from(JSON.stringify(message));

        await new Promise<void>((resolve, reject) => {
            channel.publish(
                TOPOLOGY.exchange,
                routingKey,
                body,
                {
                    persistent: true,
                    contentType: 'application/json',
                    messageId: options.messageId,
                    timestamp: Math.floor(Date.now() / 1000),
                    appId: 'safeplay-api',
                },
                (err) => (err ? reject(err) : resolve()),
            );
        });
    }

    async close(): Promise<void> {
        await this.connection?.close().catch(() => undefined);
        this.reset();
    }

    private async getChannel(): Promise<ConfirmChannel> {
        if (this.channel) return this.channel;
        if (!this.connecting) {
            this.connecting = this.connect().finally(() => {
                this.connecting = null;
            });
        }
        return this.connecting;
    }

    private async connect(): Promise<ConfirmChannel> {
        const connection = await amqp.connect(this.url, { timeout: this.connectTimeoutMs });
        connection.on('error', (err) => console.error('[rabbitmq] erro na conexão do publicador:', err.message));
        connection.on('close', () => {
            console.warn('[rabbitmq] conexão do publicador fechada');
            this.reset();
        });

        const channel = await connection.createConfirmChannel();
        channel.on('error', (err) => console.error('[rabbitmq] erro no canal do publicador:', err.message));
        channel.on('close', () => {
            this.channel = null;
        });
        await assertTopology(channel);

        this.connection = connection;
        this.channel = channel;
        console.log('[rabbitmq] publicador conectado');
        return channel;
    }

    private reset() {
        this.connection = null;
        this.channel = null;
    }
}
