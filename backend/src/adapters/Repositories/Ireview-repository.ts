import { number } from 'zod';
import {
    reviewByIdResponse,
    ReviewCreateDTO,
    reviewListFeed,
    reviewListUserParams,
    reviewResponse,
    ReviewUpdateDTO,
} from '../../core/Entities/review-entity';

export interface IReviewRepository {
    create(data: ReviewCreateDTO): Promise<{ id: string }>;
    update(data: ReviewUpdateDTO): Promise<any>;
    delete(reviewId: string): Promise<void>;
    reviewListFeed(data: reviewListFeed): Promise<reviewResponse[]>;
    reviewListByUser(data: reviewListUserParams): Promise<reviewResponse[]>;
    reviewById(reviwId: string): Promise<reviewByIdResponse | null>;
    verifyDuplicateReview(userId: string, gameId: number): Promise<boolean>;
    reviewByIdGamdAndUser(userId: String, gameId: number): Promise<any>;
}
