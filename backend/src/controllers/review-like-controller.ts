import { Request, Response } from 'express';
import { ReviewLikeCreateUsecase } from '../core/useCases/reviewLike/review-like-create.usecase';
import { ReviewLikeDeleteUsecase } from '../core/useCases/reviewLike/review-like-delete.usecase';
import { ErrorBadRequest } from '../core/Error/error-bad-request';
import { reviewLikeParams } from '../core/Entities/review-like-entity';

export class ReviewLikeController {
    constructor(
        private createLike: ReviewLikeCreateUsecase,
        private deleteLike: ReviewLikeDeleteUsecase,
    ) {}

    create = async (req: Request<{}, {}, {}, { reviewId: string; userId: string }>, res: Response) => {
        const { reviewId, userId } = req.query;
        if (!reviewId || !userId) throw new ErrorBadRequest('Não foi passado os parâmetros corretamente');

        const input: reviewLikeParams = {
            reviewId,
            userId,
        };

        await this.createLike.execute(input);

        return res.status(200).json({ message: 'ok' });
    };

    delete = async (req: Request<{}, {}, {}, { reviewId: string; userId: string }>, res: Response) => {
        const { reviewId, userId } = req.query;
        if (!reviewId || !userId) throw new ErrorBadRequest('Não foi passado os parâmetros corretamente');

        const input: reviewLikeParams = {
            reviewId,
            userId,
        };

        const out = await this.deleteLike.execute(input);

        return res.status(200).json({ message: 'ok' });
    };
}
