import { IReviewRepository } from '../../../adapters/Repositories/Ireview-repository';
import { ReviewCreateDTO } from '../../Entities/review-entity';
import { DateForStatus } from '../../../util/return-date-for-status';
import { ErrorConflitct } from '../../Error/error-conflict';
import { ErroBusinessRules } from '../../Error/error-business-rules';
import { ValidateReview } from '../../../infra/Validations/customValidate/validate-review';
import { VerifyUserService } from '../../../application/Services/user/verify-user.service';

export class ReviewCreateUsecase {
    constructor(
        private repository: IReviewRepository,
        private userVerify: VerifyUserService,
    ) {}

    async execute(data: ReviewCreateDTO) {
        ValidateReview.validateCreate(data);

        await this.userVerify.VerifyId(data.userId);
        await this.checkDuplicateReview(data.userId, data.gameId);

        data.published_at = DateForStatus.execute(data.status);

        if (data.status == 'PUBLISHED') {
            if (data.rating == null || data.rating <= 0) throw new ErroBusinessRules('Não pode ser publicado sem passar a nota');
        }

        const output = await this.repository.create(data);

        return output;
    }

    private async checkDuplicateReview(userId: string, gameId: number): Promise<void> {
        const exist = await this.repository.verifyDuplicateReview(userId, gameId);
        if (exist) throw new ErrorConflitct(null, 'Review já existe');
    }
}
