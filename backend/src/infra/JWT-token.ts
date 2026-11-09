import { IToken } from '../adapters/IToken';
import 'dotenv/config';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { ErrorUnauthorized } from '../core/Error/error-unauthorized';
import { ErrorBadRequest } from '../core/Error/error-bad-request';
import { ErrorApp } from '../core/Error/erro-app';

export class JwtToken implements IToken {
    private token = jwt;
    private secretEmail: string = '';
    private secretKey: string = '';
    constructor() {
        this.loadEnv();
    }

    loadEnv() {
        this.secretEmail = process.env.EMAIL_TOKEN!;
        this.secretKey = process.env.SECRET_KEY!;

        if (!this.secretEmail) throw new ErrorApp('Não foi passado EMAIL_TOKEN, favor verificar .env', 500);
        if (!this.secretKey) throw new ErrorApp('Não foi passado SECRET_KEY, favor verificar .env', 500);
    }

    assin(userID: string): string {
        return this.token.sign({ id: userID }, this.secretKey, {
            expiresIn: '5d',
        });
    }

    signEmailToken(userId: string): string {
        return this.token.sign({ userId: userId }, this.secretEmail, { expiresIn: '1d' });
    }

    verify(token: string, type?: 'email' | 'key'): JwtPayload {
        try {
            const secret = type === 'email' ? this.secretEmail : this.secretKey;
            const payload = this.token.verify(token, secret) as JwtPayload;
            return payload;
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new ErrorBadRequest('Token expirado');
            }
            throw new ErrorUnauthorized('Token não autorizado');
        }
    }
}
