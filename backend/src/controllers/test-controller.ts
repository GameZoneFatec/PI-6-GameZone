import { Request, Response } from 'express';

import { ErrorBadRequest } from '../core/Error/error-bad-request';
import { ErrorApp } from '../core/Error/erro-app';
import { UpgradeUserToPremiumService } from '../application/Services/paymentsServices/UpgradeUserToPremium.service';

export class TesteController {
    constructor(private teste: UpgradeUserToPremiumService) {}

    Stest(req: Request, res: Response) {
        const { userId } = req.body;

        const baseUrl = process.env.BASE_URL_FRONT;
        const verifyUrl = `${process.env.BASE_URL_FRONT}/verify-email?token=${'teste'}`;
        console.log(verifyUrl);

        res.status(200).json(verifyUrl);
    }
}
