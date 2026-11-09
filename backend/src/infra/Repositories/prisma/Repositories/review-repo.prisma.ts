import { Prisma, PrismaClient } from '@prisma/client';
import { IReviewRepository } from '../../../../adapters/Repositories/Ireview-repository';
import {
    reviewByIdResponse,
    ReviewCreateDTO,
    reviewListFeed,
    reviewListUserParams,
    reviewResponse,
    ReviewUpdateDTO,
} from '../../../../core/Entities/review-entity';
import { prisma } from '../client';
import { ErrorApp } from '../../../../core/Error/erro-app';

export class ReviwRepository implements IReviewRepository {
    constructor(private prisma: PrismaClient) {
        prisma = prisma;
    }

    async create(userGame: ReviewCreateDTO): Promise<{ id: string }> {
        try {
            const data: Prisma.ReviewCreateInput = {
                author: { connect: { id: userGame.userId } },
                gameId: Number(userGame.gameId),
                title: userGame.title,
                body: userGame.body ?? null,
                rating: userGame.rating,
                isPublic: userGame.isPublic ?? false,
                status: userGame.status,
                published_at: userGame.published_at ?? null,
            };
            const output = await prisma.review.create({
                data,
                select: { id: true },
            });

            return output;
        } catch (err) {
            throw new ErrorApp('Erro ao registrar review no banco', 500, err);
        }
    }

    async update(review: ReviewUpdateDTO) {
        try {
            const update: Prisma.ReviewUpdateInput = {
                title: review.title,
                body: review.body,
                rating: review.rating,
                status: review.status,
                isPublic: review.isPublic,
                published_at: review.published_at,
            };

            const customSelect = {
                id: true,
                title: !!review.title,
                body: !!review.body,
                rating: !!review.rating,
                status: !!review.status,
                isPublic: !!review.isPublic,
                published_at: !!review.published_at,
            };

            const data = await prisma.review.update({
                where: { id: review.id },
                data: update,
                select: customSelect,
            });

            return data;
        } catch (err) {
            throw new ErrorApp('Erro ao atualizar review no banco', 500, err);
        }
    }

    async delete(reviewId: string): Promise<void> {
        try {
            await prisma.review.delete({
                where: { id: reviewId },
            });
        } catch (err: any) {
            throw new ErrorApp('Erro ao deletar review', 500, err);
        }
    }

    async reviewListFeed(reviewParam: reviewListFeed): Promise<reviewResponse[]> {
        const { gameId, limit, page, userId } = reviewParam;

        const reviews = await prisma.review.findMany({
            where: {
                gameId,
                isPublic: true,
                status: 'PUBLISHED',
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [{ likes: { _count: 'desc' } }, { published_at: 'desc' }],
            include: {
                author: {
                    select: { id: true, username: true, profile_image_url: true },
                },
                likes: {
                    where: { userId },
                    select: { user: true },
                    take: 1,
                },
                _count: { select: { likes: true } },
            },
        });

        const output = reviews.map((r) => ({
            reviewId: r.id,
            gameId: gameId,
            title: r.title,
            body: r.body,
            rating: r.rating,
            status: r.status,
            isPublic: r.isPublic,
            published_at: r.published_at,
            author: r.author,
            likedByUser: r.likes.length > 0,
            likesCount: r._count.likes,
        }));

        return output;
    }

    async reviewListByUser(reviewParam: reviewListUserParams): Promise<reviewResponse[]> {
        const { limit, page, status, userId, title } = reviewParam;

        const review = await prisma.review.findMany({
            where: {
                userId,
                status,
                title: title ? { contains: title, mode: 'insensitive' } : undefined,
            },
            select: {
                id: true,
                gameId: true,
                body: true,
                title: true,
                rating: true,
                isPublic: true,
                status: true,
                published_at: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        profile_image_url: true,
                    },
                },
                _count: { select: { likes: true } },
                likes: {
                    where: { userId: userId },
                    select: { id: true },
                },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { updated_at: 'desc' },
        });

        const output = review.map((r) => ({
            reviewId: r.id,
            gameId: r.gameId,
            title: r.title,
            body: r.body,
            rating: r.rating,
            status: r.status,
            isPublic: r.isPublic,
            published_at: r.published_at,
            author: r.author,
            likedByUser: r.likes.length > 0,
            likesCount: r._count.likes,
        }));

        return output;
    }

    async reviewById(reviwId: string): Promise<reviewByIdResponse | null> {
        try {
            const review = await prisma.review.findUnique({
                where: { id: reviwId },
            });

            return review;
        } catch (err) {
            throw new ErrorApp('Erro ao buscar review pelo ID', 500, err);
        }
    }

    async reviewByIdGamdAndUser(userId: string, gameId: number) {
        try {
            const review = await prisma.review.findUnique({
                where: { userId_rawgId: { userId, gameId } },
                omit: {
                    updated_at: true,
                    created_at: true,
                },
            });

            return review;
        } catch (err: any) {
            throw new ErrorApp('Erro ao buscar review', 500, err);
        }
    }

    async verifyDuplicateReview(userId: string, gameId: number): Promise<boolean> {
        const game = Number(gameId);
        try {
            const exist = await prisma.review.findUnique({
                where: { userId_rawgId: { userId, gameId: game } },
                select: { id: true },
            });
            return !!exist;
        } catch (err) {
            throw new ErrorApp('Erro ao verificar duplicata de review no repositório', 500, err);
        }
    }
}
