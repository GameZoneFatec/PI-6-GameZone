import { Response, Request } from 'express';
import { LoginCreateUseCase } from '../core/useCases/login/login-create.usecase';

export class LoginController {
    constructor(private createLogin: LoginCreateUseCase) {}

    Login = async (req: Request, res: Response) => {
        const data = req.body;
        const user = await this.createLogin.execute(data);
        return res.status(201).json(user);
    };
}
