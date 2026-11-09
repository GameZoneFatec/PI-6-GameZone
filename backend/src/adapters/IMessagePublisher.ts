export type PublishOptions = {
    /** Identificador da mensagem (usamos o id da denúncia) para rastrear origem → mensagem → efeito. */
    messageId: string;
};

export interface IMessagePublisher {
    publish(routingKey: string, message: object, options: PublishOptions): Promise<void>;
}
