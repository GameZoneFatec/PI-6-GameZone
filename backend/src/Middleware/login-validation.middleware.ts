import { NextFunction, Request, Response } from 'express';
import { ILoginValidationReqeust } from '../adapters/Validations/ILoginValidationRequest';
import { ErrorBadRequest } from '../core/Error/error-bad-request';

export class LoginValidationMiddleware {
    constructor(private validate: ILoginValidationReqeust) {}

    create(req: Request, res: Response, next: NextFunction) {
        if (!req.body) throw new ErrorBadRequest('Não foi passado o body do login corretamente');

        const details = this.validate.create(req.body);

        if (details) throw new ErrorBadRequest(undefined, details);

        next();
    }
}
