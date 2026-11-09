import 'dotenv/config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ErrorBadRequest } from '../../core/Error/error-bad-request';
import { IEmail } from '../../adapters/IEmail';

export class nodemailerImpl implements IEmail {
    private host: string = '';
    private port: number = 0;
    private user: string = '';
    private pass: string = '';
    private mailFrom: string = '';
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

    constructor() {
        this.loadCredentials();
        this.transporter = this.createTransporter();
    }

    loadCredentials(): void {
        this.host = process.env.SMTP_HOST!;
        this.port = Number(process.env.SMTP_PORT!);
        this.user = process.env.SMTP_USER!;
        this.pass = process.env.SMTP_PASS!;
        this.mailFrom = process.env.MAIL_FROM!;

        if (!this.host || !this.port || !this.user || !this.pass || !this.mailFrom) {
            throw new ErrorBadRequest("SMTP faltando, favor verificar(ENV 'Funcionamento envio de email')");
        }
    }

    private createTransporter() {
        return nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: false,
            auth: {
                user: this.user,
                pass: this.pass,
            },
        });
    }

    async send(to: string, subject: string, html: string, text?: string){
        return await this.transporter.sendMail({
            from: this.mailFrom,
            to,
            subject,
            text,
            html,
        });
    }
}
