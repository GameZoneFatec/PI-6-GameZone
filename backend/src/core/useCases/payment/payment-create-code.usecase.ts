import { IPayments } from '../../../adapters/Repositories/IPayment-repository';
import { payment } from '../../../factories/mp-external';
import { ErrorBadRequest } from '../../Error/error-bad-request';

export class CreatePayment {
    constructor(private repo: IPayments) {}

    async execute(email: string, userId: string, type: string) {
        try {
            const pending = await this.repo.findPayment(userId, 'pending');
            if (pending && new Date() < pending.qr_valid) {
                return {
                    message: 'Retornando QR existente',
                    paymentId: pending.mp_payment_id,
                    qr_valid: pending.qr_valid,
                    qr_code: pending.qr_code,
                    qr_code_base64: pending.qr_code_base64,
                };
            }
            //
            if (pending && new Date() > pending.qr_valid) {
                await this.repo.updatePayment({ finished: true, status: 'cancelled' }, pending.id);
            }
            //
            //
            const createPaymentDb = await this.repo.create({
                description: '',
                mp_payment_id: '',
                payer_email: email,
                price: 0,
                status: 'pending',
                user_id: userId,
                qr_code: '',
                qr_code_base64: '',
                qr_valid: new Date(),
            });
            //
            const result = await payment.create({
                body: {
                    transaction_amount: 0.5,
                    description: 'Plano premium SafePlay',
                    payment_method_id: 'pix',
                    metadata: {
                        userId: userId,
                        internal_payment_id: createPaymentDb.id,
                    },
                    payer: {
                        email: email,
                    },
                },
            });
            const pixInfor = result.point_of_interaction?.transaction_data;
            const qrValid = result.date_of_expiration
                ? new Date(result.date_of_expiration)
                : (() => {
                      const d = new Date();
                      d.setMinutes(d.getMinutes() + 15);
                      return d;
                  })();

            const out = await this.repo.updatePayment(
                {
                    description: result.description!,
                    mp_payment_id: String(result.id!),
                    status: result.status!,
                    price: result.transaction_amount,
                    qr_code: pixInfor?.qr_code,
                    qr_code_base64: pixInfor?.qr_code_base64,
                    qr_valid: qrValid,
                },
                createPaymentDb.id,
            );
            //
            return {
                message: 'criado novo QR',
                paymentId: String(result.id!),
                id: out.id,
                status: out.status,
                user_id: userId,
                qr_code: out.qr_code,
                qr_code_base64: out.qr_code_base64,
                qr_valid: out.qr_valid,
            };
        } catch (err: any) {
            throw new ErrorBadRequest('Erro ao criar pagamento pix', err);
        }
    }
}
