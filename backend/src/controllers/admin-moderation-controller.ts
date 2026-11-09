import { Request, Response } from 'express';
import {
    ModerationDecideUsecase,
    ModerationListReportsUsecase,
    ModerationQueueUsecase,
    ModerationRepublishPendingUsecase,
    ModerationStatsUsecase,
} from '../core/useCases/moderation/moderation.usecases';

export class AdminModerationController {
    constructor(
        private queueUC: ModerationQueueUsecase,
        private decideUC: ModerationDecideUsecase,
        private listReportsUC: ModerationListReportsUsecase,
        private republishUC: ModerationRepublishPendingUsecase,
        private statsUC: ModerationStatsUsecase,
    ) {}

    queue = async (req: Request, res: Response) => {
        const { status, page, limit } = req.query;
        res.status(200).json(await this.queueUC.execute(status, page, limit));
    };

    decide = async (req: Request<{ reviewId: string }>, res: Response) => {
        const out = await this.decideUC.execute(req.params.reviewId, req.body?.decision, req.user!.id);
        res.status(200).json(out);
    };

    reports = async (req: Request, res: Response) => {
        const { status, page, limit } = req.query;
        res.status(200).json(await this.listReportsUC.execute(status, page, limit));
    };

    republishPending = async (req: Request, res: Response) => {
        res.status(200).json(await this.republishUC.execute());
    };

    stats = async (req: Request, res: Response) => {
        res.status(200).json(await this.statsUC.execute());
    };
}
