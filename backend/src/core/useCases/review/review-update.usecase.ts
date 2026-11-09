import { IReviewRepository } from '../../../adapters/Repositories/Ireview-repository';
import { ReviewUpdateDTO } from '../../Entities/review-entity';
import { ValidateReview } from '../../../infra/Validations/customValidate/validate-review';
import { ErroBusinessRules } from '../../Error/error-business-rules';
import { ErrorNotFound } from '../../Error/error-not-found';

export class ReviewUpdateUsecase {
    constructor(private repository: IReviewRepository) {}

    async execute(review: ReviewUpdateDTO) {
        ValidateReview.validateUpdate(review);

        const reviewE = await this.repository.reviewById(review.id);
        if (!reviewE) throw new ErrorNotFound('Review não encontrada/cadastrada');
        // Análise em moderação/removida não pode ser republicada pelo autor
        if (reviewE.status === 'HIDDEN' || reviewE.status === 'REMOVED') {
            throw new ErroBusinessRules(null, 'Esta análise está em moderação e não pode ser alterada');
        }

        if (!reviewE.published_at) {
            if (review.status == 'PUBLISHED') {
                if (review.rating == null || review.rating <= 0) throw new ErroBusinessRules('Não pode ser publicado sem passar a nota');
                review.published_at = new Date();
            }
        }

        const output = await this.repository.update(review);

        return output;
    }
}
