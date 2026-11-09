import { IReviewLikeRepository } from '../../../adapters/Repositories/Ireview-like-repository';
import { reviewLikeParams } from '../../Entities/review-like-entity';
import { ErrorConflitct } from '../../Error/error-conflict';

export class ReviewLikeCreateUsecase {
    constructor(private repository: IReviewLikeRepository) {}

    async execute(reviewParam: reviewLikeParams) {
        const like = await this.repository.getLike(reviewParam);
        if (like) throw new ErrorConflitct('Review Like já existe');
        await this.repository.create(reviewParam);
    }
}
