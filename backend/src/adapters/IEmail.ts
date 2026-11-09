export interface IEmail {
    send(to: string, subject: string, html: string, text?: string): Promise<any>;
}
