import { IHash } from '../../../adapters/IHash';
import { IToken } from '../../../adapters/IToken';
import { IUserRepository } from '../../../adapters/Repositories/Iuser-repository';
import { SendEmailService } from '../../../application/Services/email/sendEmailService';
import { VerifyUserService } from '../../../application/Services/user/verify-user.service';
import { UserCreateDTO } from '../../Entities/user-entity';
import 'dotenv/config';

export class UserCreateUseCase {
    constructor(
        private repository: IUserRepository,
        private hash: IHash,
        private VerfyUser: VerifyUserService,
        private sendEmail: SendEmailService,
        private jwtToken: IToken,
    ) {}

    async execute(data: UserCreateDTO) {
        await this.VerfyUser.VerifyUnique(data.email, data.username);

        data.password = await this.hash.hashPassword(data.password);

        if (data.profile_image_url) {
            data.profile_image_url = `${process.env.BASE_URL}/perfil-image/${data.profile_image_url}`;
        }
        const newUser = await this.repository.create(data);
        // Envio em segundo plano: falha de e-mail não pode derrubar o cadastro (nem o processo)
        this.sendVerifyEmail(data, newUser.id).catch((err) => console.error('[email] falha ao enviar verificação:', err?.message));

        return {
            id: newUser.id,
        };
    }

    async sendVerifyEmail(data: UserCreateDTO, userId: string) {
        const token = this.jwtToken.signEmailToken(userId);
        const verifyUrl = `${process.env.BASE_URL_FRONT}/verify-email?token=${token}`;

        await this.sendEmail.sendVerifyEmail(data.email, data.name, verifyUrl);
    }
}
