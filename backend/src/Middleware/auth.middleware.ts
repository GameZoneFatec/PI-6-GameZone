import { NextFunction, Request, Response } from 'express';
import { IToken } from '../adapters/IToken';
import { IUserRepository } from '../adapters/Repositories/Iuser-repository';
import { ErrorUnauthorized } from '../core/Error/error-unauthorized';
import { ErrorForbidden } from '../core/Error/error-forbidden';

export type AuthUser = { id: string; role?: 'USER' | 'ADMIN' };

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export class AuthMiddleware {
    constructor(
        private token: IToken,
        private userRepo?: IUserRepository,
    ) {}

    /** Exige um JWT válido (Authorization: Bearer <token>) e preenche req.user. */
    auth = (req: Request, res: Response, next: NextFunction) => {
        const authToken = req.headers.authorization;
        if (!authToken) throw new ErrorUnauthorized('Token não foi passado corretamente');

        const [scheme, tokenReq] = authToken.split(' ');
        if (scheme !== 'Bearer' || !tokenReq) throw new ErrorUnauthorized('Token inválido');

        const payload = this.token.verify(tokenReq);
        if (!payload.id) throw new ErrorUnauthorized('Token inválido');

        req.user = { id: String(payload.id) };
        next();
    };

    /**
     * Exige papel ADMIN. O papel é lido do banco a cada requisição (e não do token),
     * assim promover/rebaixar um usuário tem efeito imediato.
     */
    admin = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw new ErrorUnauthorized('Usuário não autenticado');
        if (!this.userRepo) throw new Error('AuthMiddleware.admin requer um repositório de usuários');

        const user = await this.userRepo.findById(req.user.id);
        if (!user) throw new ErrorUnauthorized('Usuário não encontrado');
        if (user.role !== 'ADMIN') throw new ErrorForbidden('Acesso restrito a administradores');

        req.user.role = 'ADMIN';
        next();
    };
}
