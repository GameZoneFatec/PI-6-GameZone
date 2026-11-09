import { IReviewLikeRepository } from '../../../adapters/Repositories/Ireview-like-repository';
import { IReviewRepository } from '../../../adapters/Repositories/Ireview-repository';
import { ErrorBadRequest } from '../../Error/error-bad-request';

export class ReviewDeleteUsecase {
    constructor(private repository: IReviewRepository) {}

    async execute(reviewId: string) {
        const review = await this.repository.reviewById(reviewId);
        if (!review) throw new ErrorBadRequest('Review não cadastrada/encontrada');
        await this.repository.delete(reviewId);
    }
}
