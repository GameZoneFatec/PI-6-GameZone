import { reviewLikeParams } from '../../core/Entities/review-like-entity';

export interface IReviewLikeRepository {
    create(data: reviewLikeParams): Promise<any>;
    delete(data: reviewLikeParams): Promise<any>;
    getLike(data: reviewLikeParams): Promise<any>;
}
