import 'dotenv/config';
import nodemailer from 'nodemailer';
import { ErrorBadRequest } from '../../core/Error/error-bad-request';
import { IEmail } from '../../adapters/IEmail';

/**
 * MAIL_DRIVER=smtp (padrão): envia pelo servidor SMTP configurado.
 * MAIL_DRIVER=console: não envia nada; mostra destinatário, assunto e links no console.
 * Útil em desenvolvimento/demonstração sem um SMTP real (ex.: copiar o link de verificação).
 */
export class nodemailerImpl implements IEmail {
    private host: string = '';
    private port: number = 0;
    private user: string = '';
    private pass: string = '';
    private mailFrom: string = '';
    private consoleMode = process.env.MAIL_DRIVER === 'console';
    private transporter: nodemailer.Transporter<any>;

    constructor() {
        if (this.consoleMode) {
            this.mailFrom = process.env.MAIL_FROM ?? 'SafePlay <nao-responda@localhost>';
            this.transporter = nodemailer.createTransport({ jsonTransport: true });
            return;
        }
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
            throw new ErrorBadRequest("SMTP faltando, favor verificar(ENV 'Funcionamento envio de email') ou use MAIL_DRIVER=console");
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

    async send(to: string, subject: string, html: string, text?: string) {
        const info = await this.transporter.sendMail({
            from: this.mailFrom,
            to,
            subject,
            text,
            html,
        });
        if (this.consoleMode) {
            const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
            console.log(`[email:console] para=${to} assunto="${subject}"${links.length ? `\n  links: ${links.join('\n         ')}` : ''}`);
        }
        return info;
    }
}
