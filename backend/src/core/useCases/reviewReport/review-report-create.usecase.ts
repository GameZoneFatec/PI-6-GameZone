import { IMessagePublisher } from '../../../adapters/IMessagePublisher';
import { IReviewRepository } from '../../../adapters/Repositories/Ireview-repository';
import { IReviewReportRepository } from '../../../adapters/Repositories/Ireview-report-repository';
import { REPORT_REASONS, ReportReasonType, ReviewReportedMessage } from '../../Entities/review-report-entity';
import { ErrorBadRequest } from '../../Error/error-bad-request';
import { ErrorNotFound } from '../../Error/error-not-found';
import { ErroBusinessRules } from '../../Error/error-business-rules';
import { ErrorConflitct } from '../../Error/error-conflict';

export const REVIEW_REPORTED_ROUTING_KEY = 'review.reported';

export type ReviewReportCreateInput = {
    reviewId: string;
    reporterId: string;
    reason: unknown;
    details?: unknown;
};

export type ReviewReportCreateOutput = {
    reportId: string;
    reviewId: string;
    status: 'PENDING';
    queued: boolean;
    message: string;
};

/**
 * Registra a denúncia e publica "review.reported" no broker.
 *
 * A denúncia é gravada ANTES de publicar. Se o broker estiver fora do ar,
 * a denúncia fica PENDING (com o erro registrado) e pode ser republicada
 * pelo backoffice — o usuário não perde a denúncia.
 */
export class ReviewReportCreateUsecase {
    constructor(
        private reportRepo: IReviewReportRepository,
        private reviewRepo: IReviewRepository,
        private publisher: IMessagePublisher,
    ) {}

    async execute(input: ReviewReportCreateInput): Promise<ReviewReportCreateOutput> {
        const { reason, details } = this.validate(input);

        const review = await this.reviewRepo.reviewById(input.reviewId);
        if (!review) throw new ErrorNotFound('Análise não encontrada');
        if (review.status !== 'PUBLISHED' || !review.isPublic) {
            throw new ErroBusinessRules(null, 'Só é possível denunciar análises publicadas');
        }
        if (review.userId === input.reporterId) throw new ErroBusinessRules(null, 'Você não pode denunciar a sua própria análise');

        if (await this.reportRepo.existsForReporter(input.reviewId, input.reporterId)) {
            throw new ErrorConflitct(null, 'Você já denunciou esta análise');
        }

        const report = await this.reportRepo.create({ reviewId: input.reviewId, reporterId: input.reporterId, reason, details });

        const message: ReviewReportedMessage = {
            event: 'review.reported',
            version: 1,
            reportId: report.id,
            reviewId: report.reviewId,
            reporterId: report.reporterId,
            reason: report.reason,
            occurredAt: report.created_at.toISOString(),
        };

        const queued = await publishReport(this.publisher, this.reportRepo, message);

        return {
            reportId: report.id,
            reviewId: report.reviewId,
            status: 'PENDING',
            queued,
            message: queued
                ? 'Denúncia recebida e enviada para análise'
                : 'Denúncia recebida; o processamento será retomado assim que o serviço de moderação voltar',
        };
    }

    private validate(input: ReviewReportCreateInput): { reason: ReportReasonType; details: string | null } {
        const errors: { field: string; message: string }[] = [];

        if (!input.reviewId) errors.push({ field: 'reviewId', message: 'reviewId é obrigatório' });

        const reason = typeof input.reason === 'string' ? input.reason.toUpperCase() : input.reason;
        if (!REPORT_REASONS.includes(reason as ReportReasonType)) {
            errors.push({ field: 'reason', message: `reason deve ser um de: ${REPORT_REASONS.join(', ')}` });
        }

        let details: string | null = null;
        if (input.details !== undefined && input.details !== null && input.details !== '') {
            if (typeof input.details !== 'string') errors.push({ field: 'details', message: 'details deve ser texto' });
            else if (input.details.length > 500) errors.push({ field: 'details', message: 'details pode ter no máximo 500 caracteres' });
            else details = input.details.trim();
        }
        if (reason === 'OTHER' && !details) errors.push({ field: 'details', message: 'Descreva o motivo quando reason = OTHER' });

        if (errors.length) throw new ErrorBadRequest('Erro na validação da denúncia', errors);
        return { reason: reason as ReportReasonType, details };
    }
}

/** Publica a mensagem e registra a tentativa. Nunca lança: devolve se foi enfileirada. */
export async function publishReport(
    publisher: IMessagePublisher,
    reportRepo: IReviewReportRepository,
    message: ReviewReportedMessage,
): Promise<boolean> {
    try {
        await publisher.publish(REVIEW_REPORTED_ROUTING_KEY, message, { messageId: message.reportId });
        await reportRepo.registerPublishAttempt(message.reportId, null);
        console.log(`[report:${message.reportId}] publicada em ${REVIEW_REPORTED_ROUTING_KEY} (review ${message.reviewId})`);
        return true;
    } catch (err: any) {
        const reason = err?.message ?? String(err);
        console.error(`[report:${message.reportId}] falha ao publicar no broker: ${reason}`);
        await reportRepo.registerPublishAttempt(message.reportId, reason).catch(() => undefined);
        return false;
    }
}
