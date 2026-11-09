import { Request, Response } from 'express';
import { ReviewReportCreateUsecase } from '../core/useCases/reviewReport/review-report-create.usecase';
import { ErrorUnauthorized } from '../core/Error/error-unauthorized';

export class ReviewReportController {
    constructor(private createReport: ReviewReportCreateUsecase) {}

    /** POST /review/:reviewId/report — o denunciante vem do token, não do body. */
    create = async (req: Request<{ reviewId: string }>, res: Response) => {
        if (!req.user) throw new ErrorUnauthorized('Usuário não autenticado');

        const out = await this.createReport.execute({
            reviewId: req.params.reviewId,
            reporterId: req.user.id,
            reason: req.body?.reason,
            details: req.body?.details,
        });

        // 202 Accepted: recebida; o efeito (contagem/ocultação) acontece de forma assíncrona no worker.
        return res.status(202).json(out);
    };
}
