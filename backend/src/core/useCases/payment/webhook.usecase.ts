import { IPayments } from '../../../adapters/Repositories/IPayment-repository';
import { UpgradeUserToPremiumService } from '../../../application/Services/paymentsServices/UpgradeUserToPremium.service';
import { payment } from '../../../factories/mp-external';
import { ErrorApp } from '../../Error/erro-app';

export class webhookUsecase {
    constructor(
        private subscribe: UpgradeUserToPremiumService,
        private paymentRepo: IPayments,
    ) {}

    public async execute(type: string, action: string, data: any) {
        try {
            if (action == 'payment.updated') {
                const id = data.id;

                const result = await payment.get({ id });
                const status = result.status;
                const userId = result.metadata.user_id;
                const my_payment_id = result.metadata.internal_payment_id;

                if (status == 'approved') {
                    this.subscribe.execute(userId);
                    this.paymentRepo.updatePayment(
                        {
                            finished: true,
                            status: status,
                        },
                        my_payment_id,
                    );
                }
            }
        } catch (err: any) {
            throw new ErrorApp('Erro de tudo', 500, err);
        }
    }
}
