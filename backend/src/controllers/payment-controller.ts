import { Request, Response } from 'express';
import { CreatePayment } from '../core/useCases/payment/payment-create-code.usecase';
import { ErrorBadRequest } from '../core/Error/error-bad-request';
import { webhookUsecase } from '../core/useCases/payment/webhook.usecase';
import { string } from 'zod';
import { getPaymentStatus } from '../core/useCases/payment/get-payment-status.usecase';

export class PaymentController {
    constructor(
        private createQRcodeUsecase: CreatePayment,
        private webHookUsecase: webhookUsecase,
        private getPaymentStatusUC: getPaymentStatus,
    ) {}

    createSubscription = async (req: Request, res: Response) => {
        const { email, userId, type } = req.body;
        if (!email) throw new ErrorBadRequest('Email foi passado vazio');
        if (!userId) throw new ErrorBadRequest('userId foi passado vazio');
        if (!type) throw new ErrorBadRequest('type foi passado vazio');
        const out = await this.createQRcodeUsecase.execute(email, userId, type);

        return res.status(200).json(out);
    };

    webHook = async (req: Request, res: Response) => {
        const { type, action, data } = req.body;
        const out = await this.webHookUsecase.execute(type, action, data);

        return res.status(200).json(out);
    };

    paymentStatus = async (req: Request<{ paymentId: string }>, res: Response) => {
        const { paymentId } = req.params;

        if (!paymentId) {
            throw new ErrorBadRequest('Parametro não foi passado');
        }

        const out = await this.getPaymentStatusUC.execute(paymentId);

        return res.status(200).json(out);
    };
}
