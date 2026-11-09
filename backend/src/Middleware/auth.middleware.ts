import { NextFunction, Request, Response } from 'express';
import { ErrorBadRequest } from '../core/Error/error-bad-request';
import { IToken } from '../adapters/IToken';
import { ErrorUnauthorized } from '../core/Error/error-unauthorized';

export class AuthMiddleware {
    private token: IToken;

    constructor(tokeInstance: IToken) {
        this.token = tokeInstance;
    }

    auth = (req: Request, res: Response, next: NextFunction) => {
        const authToken = req.headers.authorization;
        if (!authToken) throw new ErrorUnauthorized('Token não foi passado corretamente');

        const tokenReq = authToken.split(' ').at(1);

        if (!tokenReq) throw new ErrorUnauthorized('Token inválido');

        this.token.verify(tokenReq);

        next();
    };
}
