import { ReviewCreateDTO, reviewListFeed, reviewListUserParams, ReviewUpdateDTO } from '../core/Entities/review-entity';
import { ErrorBadRequest } from '../core/Error/error-bad-request';
import { ReviewCreateUsecase } from '../core/useCases/review/review-create.usecase';
import { Request, Response } from 'express';
import { ReviewUpdateUsecase } from '../core/useCases/review/review-update.usecase';
import { ReviewGetByIdUsecase } from '../core/useCases/review/review-get-by-id.usecase';
import { ReviewListFeedUsecase } from '../core/useCases/review/review-list-feed.usecase';
import { ReviewListByUserUsecase } from '../core/useCases/review/review-list-by-user.usecase';
import { ReviewStatus } from '@prisma/client';
import { ReviewDeleteUsecase } from '../core/useCases/review/review-delete.usecase';
import { VerifyNumeric } from '../util/verify-numeric';
import { reviewGetByUserIdAndGameId } from '../core/useCases/review/review-get-by-userId-and-gameId.usecase';

export class ReviewController {
    constructor(
        private createReview: ReviewCreateUsecase,
        private updateReview: ReviewUpdateUsecase,
        private getByIdreviewU: ReviewGetByIdUsecase,
        private listfeedUsecase: ReviewListFeedUsecase,
        private listByUserUsecase: ReviewListByUserUsecase,
        private deleteReviewUsecase: ReviewDeleteUsecase,
        private GetByUserAndGameUseCase: reviewGetByUserIdAndGameId,
    ) {}

    create = async (req: Request, res: Response) => {
        const { userId, gameId, title, body, rating, status, isPublic } = req.body;
        const createDTO: ReviewCreateDTO = {
            userId,
            gameId,
            body,
            rating,
            status,
            title,
            isPublic: Boolean(isPublic === 'true' || isPublic === true),
        };

        const output = await this.createReview.execute(createDTO);

        res.status(201).json(output);
    };

    update = async (req: Request, res: Response) => {
        const { title, body, rating, status, isPublic } = req.body;
        const { reviewId } = req.params;
        if (!reviewId) throw new ErrorBadRequest('IdReview não foi passado');
        const updateDTO: ReviewUpdateDTO = {
            id: reviewId,
            title,
            body,
            rating,
            status,
            isPublic: Boolean(isPublic === 'true' || isPublic === true),
        };

        const output = await this.updateReview.execute(updateDTO);

        res.status(200).json(output);
    };

    delete = async (req: Request, res: Response) => {
        const { reviewId } = req.params;
        if (!reviewId) throw new ErrorBadRequest('reviewID não foi passado corretamente');

        this.deleteReviewUsecase.execute(reviewId);

        return res.status(200).json({ message: 'Review deletada com sucesso!' });
    };

    listFeed = async (req: Request, res: Response) => {
        const { gameId, page, limit, userId } = req.query;
        if (!gameId) throw new ErrorBadRequest('GameId não foi passado');
        if (!userId) throw new ErrorBadRequest('Id do usuário não foi passado');

        const input: reviewListFeed = {
            limit: Number(limit),
            page: Number(page),
            gameId: Number(gameId),
            userId: userId as string,
        };

        const output = await this.listfeedUsecase.execute(input);

        res.status(200).json(output);
    };

    listUser = async (
        req: Request<
            { userId: string },
            {},
            {},
            { page?: number; limit?: number; title?: string | null | undefined; status?: ReviewStatus }
        >,
        res: Response,
    ) => {
        const { userId } = req.params;
        if (!userId) throw new ErrorBadRequest('userId não foi informado');
        const { page, limit, title, status } = req.query;

        const input: reviewListUserParams = {
            userId,
            limit: Number(limit),
            page: Number(page),
            status: status,
            title: title,
        };
        const out = await this.listByUserUsecase.execute(input);

        res.status(201).json(out);
    };

    getByUserIdAndGameId = async (req: Request<any, any, any, { userId: string; gameId: number }>, res: Response) => {
        const { userId, gameId } = req.query;
        if (!userId) throw new ErrorBadRequest('UserId não foi passado');
        if (!gameId) throw new ErrorBadRequest('GameID não foi passado');
        VerifyNumeric.execute(Number(gameId), 'GameId');

        const out = await this.GetByUserAndGameUseCase.execute(userId, Number(gameId));

        res.status(200).json(out);
    };

    getById = async (req: Request, res: Response) => {
        const { reviewId } = req.params;
        if (!reviewId) throw new ErrorBadRequest('Não foi passado o reviewId');
        const output = await this.getByIdreviewU.execute(reviewId);
        res.status(200).json(output);
    };
}
