import { IReviewRepository } from '../../../adapters/Repositories/Ireview-repository';
import { reviewListFeed } from '../../Entities/review-entity';

export class ReviewListFeedUsecase {
    constructor(private repository: IReviewRepository) {}

    async execute(reviewParam: reviewListFeed) {
        return await this.repository.reviewListFeed(reviewParam);
    }
}
