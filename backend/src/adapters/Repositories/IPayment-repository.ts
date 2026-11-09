import { createPayment, updatePayment } from '../../core/Entities/payment-entity';

export interface IPayments {
    create(data: createPayment): Promise<any>;
    findPayment(userId: string, status?: string): Promise<any>;
    updatePayment(data: updatePayment, idPayment: number): Promise<any>;
    paymentStatus(paymentId: string): Promise<any>;
}
