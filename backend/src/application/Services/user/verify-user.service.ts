import { IUserRepository } from '../../../adapters/Repositories/Iuser-repository';
import { UserResponseDTO } from '../../../core/Entities/user-entity';
import { ErrorBadRequest } from '../../../core/Error/error-bad-request';
import { ErrorConflitct } from '../../../core/Error/error-conflict';
import { ErrorUnauthorized } from '../../../core/Error/error-unauthorized';

export class VerifyUserService {
    constructor(private repoUser: IUserRepository) {}

    private messageFail = 'Usuário não encontrado/cadastrado';
    private erroConflit = 'Erro na com dados únicos ';

    async VerifyId(userId: string): Promise<UserResponseDTO | null> {
        const user = await this.repoUser.findById(userId);
        if (!user) throw new ErrorBadRequest(this.messageFail);
        return user;
    }

    async VerifyEmail(userEmail: string): Promise<UserResponseDTO | null> {
        const user = await this.repoUser.findByEmail(userEmail);
        if (!user) throw new ErrorBadRequest(this.messageFail);
        return user;
    }

    async VerifyUsername(username: string): Promise<UserResponseDTO | null> {
        const user = await this.repoUser.findByUsername(username);
        if (!user) throw new ErrorBadRequest(this.messageFail);
        return user;
    }

    async VerifyUnique(email?: string, username?: string, userId?: string): Promise<void> {
        const details: { field: string; message: string }[] = [];

        if (email) {
            const existingEmail = await this.repoUser.findByEmail(email);
            if (userId) {
                if (existingEmail && existingEmail.id !== userId) details.push({ field: 'email', message: 'E-mail já cadastrado' });
            } else {
                if (existingEmail) details.push({ field: 'email', message: 'E-mail já cadastrado' });
            }
        }

        if (username) {
            const existingUser = await this.repoUser.findByUsername(username);
            if (userId) {
                if (existingUser && existingUser.id !== userId) details.push({ field: 'username', message: 'Username já cadastrado' });
            } else {
                if (existingUser) details.push({ field: 'username', message: 'Username já cadastrado' });
            }
        }

        if (details.length > 0) {
            throw new ErrorConflitct(details, this.erroConflit);
        }
    }

    async EmailWithPassword(email: string) {
        const user = await this.repoUser.findByEmailWithPassword(email);
        if (!user) {
            throw new ErrorUnauthorized('Usuário não autorizado, verifique email e senha');
        }

        return user;
    }
}
