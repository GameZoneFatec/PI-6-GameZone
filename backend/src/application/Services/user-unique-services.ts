import { IUserRepository } from '../../adapters/Repositories/Iuser-repository';
import { ErrorConflitct } from '../../core/Error/error-conflict';

export class UserUniquenessService {
    constructor(private readonly userRepo: IUserRepository) {}

    async verify(email?: string, username?: string, UserId?: string) {
        const details: { field: string; message: string }[] = [];

        if (email) {
            const existingEmail = await this.userRepo.findByEmail(email);
            if (UserId) {
                if (existingEmail && existingEmail.id !== UserId) details.push({ field: 'email', message: 'E-mail já cadastrado' });
            } else {
                if (existingEmail) details.push({ field: 'email', message: 'E-mail já cadastrado' });
            }
        }

        if (username) {
            const existingUser = await this.userRepo.findByUsername(username);
            if (UserId) {
                if (existingUser && existingUser.id !== UserId) details.push({ field: 'username', message: 'Username já cadastrado' });
            } else {
                if (existingUser) details.push({ field: 'username', message: 'Username já cadastrado' });
            }
        }

        if (details.length > 0) {
            throw new ErrorConflitct(details, 'Erro na com dados únicos');
        }
    }
}
