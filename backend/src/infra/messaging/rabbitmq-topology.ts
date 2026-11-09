import type { Channel } from 'amqplib';

/**
 * Topologia da mensageria do SafePlay.
 *
 *  API (publicador) ──► exchange "safeplay.events" (topic)
 *                          │ routing key "review.reported"
 *                          ▼
 *                 fila "moderation.review-reported" ──► worker de moderação
 *                          │ (mensagem rejeitada pelo worker)
 *                          ▼
 *        exchange "safeplay.dlx" ──► fila "moderation.review-reported.dlq"
 */
export const TOPOLOGY = {
    exchange: 'safeplay.events',
    deadLetterExchange: 'safeplay.dlx',
    reviewReported: {
        routingKey: 'review.reported',
        queue: 'moderation.review-reported',
        deadLetterQueue: 'moderation.review-reported.dlq',
    },
} as const;

export async function assertTopology(channel: Channel): Promise<void> {
    const { exchange, deadLetterExchange, reviewReported } = TOPOLOGY;

    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertExchange(deadLetterExchange, 'topic', { durable: true });

    await channel.assertQueue(reviewReported.deadLetterQueue, { durable: true });
    await channel.bindQueue(reviewReported.deadLetterQueue, deadLetterExchange, reviewReported.routingKey);

    await channel.assertQueue(reviewReported.queue, {
        durable: true,
        deadLetterExchange,
        deadLetterRoutingKey: reviewReported.routingKey,
    });
    await channel.bindQueue(reviewReported.queue, exchange, reviewReported.routingKey);
}

export function rabbitUrl(): string {
    return process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
}
