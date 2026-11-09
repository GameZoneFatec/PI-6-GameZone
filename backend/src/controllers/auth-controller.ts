import { Request, Response } from 'express';
import { AuthVerifyEmailUsecase } from '../core/useCases/auth/auth-verify-email.usecase';
import { ErrorBadRequest } from '../core/Error/error-bad-request';

export class AuthController {
    constructor(private auth: AuthVerifyEmailUsecase) {}

    verifyEmail = async (req: Request, res: Response) => {
        const { token } = req.body;
        if (!token) throw new ErrorBadRequest('Não foi passado o token');

        await this.auth.verifyEmail(token);

        return res.status(200).json({ message: 'email verificado com sucesso!' });
    };
}
