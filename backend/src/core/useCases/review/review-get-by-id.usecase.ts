import { IReviewRepository } from '../../../adapters/Repositories/Ireview-repository';

export class ReviewGetByIdUsecase {
    constructor(private repository: IReviewRepository) {}

    async execute(reviewId: string) {
        return await this.repository.reviewById(reviewId);
    }
}
