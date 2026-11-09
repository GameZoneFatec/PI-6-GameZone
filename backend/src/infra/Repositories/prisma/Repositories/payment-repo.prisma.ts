import { Prisma } from '@prisma/client';
import { IPayments } from '../../../../adapters/Repositories/IPayment-repository';
import { createPayment, updatePayment } from '../../../../core/Entities/payment-entity';
import { prisma } from '../client';
import { ErrorApp } from '../../../../core/Error/erro-app';

export class PaymentRepo implements IPayments {
    async create(createPayment: createPayment): Promise<{ id: number }> {
        try {
            const data: Prisma.PaymentsCreateInput = {
                user_id: createPayment.user_id,
                description: createPayment.description,
                mp_payment_id: String(createPayment.mp_payment_id),
                payer_email: createPayment.payer_email,
                price: createPayment.price,
                status: createPayment.status,
                qr_code: createPayment.qr_code,
                qr_code_base64: createPayment.qr_code_base64,
                qr_valid: createPayment.qr_valid,
            };

            const out = await prisma.payments.create({
                data: data,
                select: { id: true },
            });

            return out;
        } catch (err: any) {
            throw new ErrorApp('Erro ao cadastrar pagamento no banco', 500, err);
        }
    }

    async findPayment(userId: string, status?: string): Promise<any> {
        try {
            const out = await prisma.payments.findFirst({
                where: {
                    user_id: userId,
                    status: status,
                },
                select: {
                    id: true,
                    user_id: true,
                    mp_payment_id: true,
                    description: true,
                    finished: true,
                    qr_code: true,
                    qr_code_base64: true,
                    qr_valid: true,
                    status: true,
                },
            });

            return out;
        } catch (err: any) {
            throw new ErrorApp('Erro ao buscar pagamentos', 500, err);
        }
    }

    async updatePayment(data: updatePayment, idPayment: number): Promise<any> {
        try {
            const out = await prisma.payments.update({
                data: data,
                where: { id: idPayment },
            });

            return out;
        } catch (err: any) {
            throw new ErrorApp('Erro ao atualizar pagamento', 500, err);
        }
    }

    async paymentStatus(paymentId: string) {
        console.log(paymentId)
        try {
            const out = await prisma.payments.findFirst({
                where: { mp_payment_id: paymentId },
            });

            return out;
        } catch (err) {
            throw new ErrorApp('Erro ao buscar status no pagamento', 500, err);
        }
    }
}
