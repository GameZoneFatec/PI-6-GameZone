import { IPayments } from '../../../adapters/Repositories/IPayment-repository';

export class getPaymentStatus {
    constructor(private paymentRepo: IPayments) {}

    async execute(paymentId: string) {
        const prod = await this.paymentRepo.paymentStatus(paymentId);

        return prod
    }
}
