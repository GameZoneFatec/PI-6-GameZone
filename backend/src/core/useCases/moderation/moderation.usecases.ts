import { IMessagePublisher } from '../../../adapters/IMessagePublisher';
import { IReviewReportRepository } from '../../../adapters/Repositories/Ireview-report-repository';
import { ModerationDecision, ModerationStats, ReportStatusType, ReviewReportedMessage } from '../../Entities/review-report-entity';
import { ErrorBadRequest } from '../../Error/error-bad-request';
import { publishReport } from '../reviewReport/review-report-create.usecase';

const REVIEW_FILTERS = ['HIDDEN', 'PUBLISHED', 'REMOVED'] as const;
const REPORT_FILTERS: ReportStatusType[] = ['PENDING', 'PROCESSED', 'ACCEPTED', 'DISMISSED'];

function pagination(page: unknown, limit: unknown) {
    const p = page === undefined ? 1 : Number(page);
    const l = limit === undefined ? 20 : Number(limit);
    if (!Number.isInteger(p) || p < 1) throw new ErrorBadRequest('page deve ser um inteiro >= 1');
    if (!Number.isInteger(l) || l < 1 || l > 100) throw new ErrorBadRequest('limit deve ser um inteiro entre 1 e 100');
    return { page: p, limit: l };
}

/** Fila de moderação: análises ocultadas pelo worker (padrão) ou outras situações. */
export class ModerationQueueUsecase {
    constructor(private repo: IReviewReportRepository) {}

    async execute(status: unknown, page: unknown, limit: unknown) {
        const s = (status ?? 'HIDDEN') as (typeof REVIEW_FILTERS)[number];
        if (!REVIEW_FILTERS.includes(s)) throw new ErrorBadRequest(`status deve ser um de: ${REVIEW_FILTERS.join(', ')}`);
        const pg = pagination(page, limit);
        return this.repo.moderationQueue(s, pg.page, pg.limit);
    }
}

/** Decisão do administrador: manter (KEEP) ou remover (REMOVE) a análise. */
export class ModerationDecideUsecase {
    constructor(private repo: IReviewReportRepository) {}

    async execute(reviewId: string, decision: unknown, adminId: string) {
        if (decision !== 'KEEP' && decision !== 'REMOVE') {
            throw new ErrorBadRequest('decision deve ser KEEP ou REMOVE', [{ field: 'decision' }]);
        }
        const out = await this.repo.decide(reviewId, decision as ModerationDecision, adminId);
        console.log(
            `[moderation] admin ${adminId} decidiu ${decision} para review ${reviewId} (${out.resolvedReports} denúncias resolvidas)`,
        );
        return out;
    }
}

export class ModerationListReportsUsecase {
    constructor(private repo: IReviewReportRepository) {}

    async execute(status: unknown, page: unknown, limit: unknown) {
        if (status !== undefined && !REPORT_FILTERS.includes(status as ReportStatusType)) {
            throw new ErrorBadRequest(`status deve ser um de: ${REPORT_FILTERS.join(', ')}`);
        }
        const pg = pagination(page, limit);
        return this.repo.listByStatus(status as ReportStatusType | undefined, pg.page, pg.limit);
    }
}

/**
 * Recuperação: republica denúncias que ficaram PENDING (ex.: broker estava fora
 * do ar no momento da denúncia). Ignora as muito recentes, que provavelmente
 * ainda estão na fila aguardando o worker.
 */
export class ModerationRepublishPendingUsecase {
    constructor(
        private repo: IReviewReportRepository,
        private publisher: IMessagePublisher,
        private minAgeMs = 30_000,
    ) {}

    async execute() {
        const pending = await this.repo.listPending(new Date(Date.now() - this.minAgeMs), 100);
        let published = 0;
        for (const r of pending) {
            const message: ReviewReportedMessage = {
                event: 'review.reported',
                version: 1,
                reportId: r.id,
                reviewId: r.reviewId,
                reporterId: r.reporterId,
                reason: r.reason,
                occurredAt: r.created_at.toISOString(),
            };
            if (await publishReport(this.publisher, this.repo, message)) published++;
        }
        return { found: pending.length, published, failed: pending.length - published };
    }
}

export class ModerationStatsUsecase {
    constructor(
        private repo: IReviewReportRepository,
        private threshold: number,
    ) {}

    async execute(): Promise<ModerationStats> {
        return { ...(await this.repo.stats()), threshold: this.threshold };
    }
}
