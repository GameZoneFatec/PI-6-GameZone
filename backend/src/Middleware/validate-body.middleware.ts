import { NextFunction, Request, Response } from 'express';
import { ErrorBadRequest } from '../core/Error/error-bad-request';

export class ValidateRequest {
    static validateBody(validate: string[], mandatory?: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.body == null || undefined) throw new ErrorBadRequest('Body foi passado vazio');
            const keys = Object.keys(req.body);

            if (mandatory?.length) {
                const missing = mandatory.filter((k) => !keys.includes(k));
                if (missing.length) {
                    const details = missing.map((field) => ({ field }));
                    throw new ErrorBadRequest('Campo obrigatório faltando', details);
                }
            }

            if (validate.length > 0) {
                const invalid = keys.filter((k) => !validate.includes(k));
                if (invalid.length > 0) {
                    const details = invalid.map((field) => ({ field }));
                    throw new ErrorBadRequest('campos não permitido', details);
                }
            }

            next();
        };
    }
}
