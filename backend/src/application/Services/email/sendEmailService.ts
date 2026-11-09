import { IEmail } from '../../../adapters/IEmail';
import { ErrorApp } from '../../../core/Error/erro-app';
import { premiumActivatedTemplate } from './templates/premium-actived.template';
import { verifyEmailTemplate } from './templates/verify-email.template';
import { welcomeTemplate } from './templates/welcomeTemplate';

export class SendEmailService {
    constructor(private sendEmail: IEmail) {}

    async sendWelcomeEmail(to: string, name: string) {
        try {
            const user = name.split(' ')[0];
            const template = welcomeTemplate(user!);
            return await this.sendEmail.send(to, 'Bem vinde ao SafeZone', template);
        } catch (err: any) {
            throw new ErrorApp('Erro ao enviar email', 500, err);
        }
    }

    async sendVerifyEmail(to: string, name: string, verifyUrl: string) {
        const subject = 'Confirme seu e-mail - SafePlay';
        const template = verifyEmailTemplate(name, verifyUrl);
        await this.sendEmail.send(to, subject, template);
    }

    async sendPremiumActiveted(to: string, name: string) {
        const subject = 'SafeZone Premium ativado 🎉';
        const template = premiumActivatedTemplate(name);
        await this.sendEmail.send(to, subject, template);
    }
}
