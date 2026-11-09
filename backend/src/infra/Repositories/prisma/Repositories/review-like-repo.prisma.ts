import { IReviewLikeRepository } from '../../../../adapters/Repositories/Ireview-like-repository';
import { reviewLikeParams } from '../../../../core/Entities/review-like-entity';
import { ErrorApp } from '../../../../core/Error/erro-app';
import { prisma } from '../client';

export class ReviewLikeRepository implements IReviewLikeRepository {
    async create(data: reviewLikeParams): Promise<any> {
        try {
            return await prisma.reviewLike.create({
                data,
                select: {
                    id: true,
                },
            });
        } catch (err) {
            throw new ErrorApp('Erro ao cadastrar o like', 500, err);
        }
    }

    async delete(data: reviewLikeParams): Promise<any> {
        return await prisma.reviewLike.delete({
            where: {
                review_user_unique: {
                    reviewId: data.reviewId,
                    userId: data.userId,
                },
            },
            select: {
                id: true,
            },
        });
    }

    async getLike(data: reviewLikeParams): Promise<any> {
        return await prisma.reviewLike.findUnique({
            where: { review_user_unique: { reviewId: data.reviewId, userId: data.userId } },
            select: { id: true },
        });
    }
}
