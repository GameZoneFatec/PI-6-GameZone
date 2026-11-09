import { IHash } from '../../../adapters/IHash';
import { LoginEntity, LoginResponse } from '../../Entities/login-entity';
import { ErrorBadRequest } from '../../Error/error-bad-request';
import { IToken } from '../../../adapters/IToken';
import { VerifyUserService } from '../../../application/Services/user/verify-user.service';

export class LoginCreateUseCase {
    constructor(
        private userVerify: VerifyUserService,
        private hash: IHash,
        private token: IToken,
    ) {}

    async execute(data: LoginEntity): Promise<LoginResponse> {
        const user = await this.userVerify.EmailWithPassword(data.email);
        //
        const compare = await this.hash.compare(data.password, user.password!);
        //
        if (!compare) throw new ErrorBadRequest('Senha ou email está incorreto');

        return {
            userId: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            premium: user.premium,
            plan_expires_at: user.plan_expires_at,
            token: this.token.assin(user.id),
        };
    }
}
