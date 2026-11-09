import { IMessagePublisher, PublishOptions } from '../src/adapters/IMessagePublisher';
import { IReviewReportRepository } from '../src/adapters/Repositories/Ireview-report-repository';
import {
    ModerationDecision,
    ProcessReportResult,
    ReportStatusType,
    ReviewReportCreateDTO,
    ReviewReportRecord,
} from '../src/core/Entities/review-report-entity';

export type FakeReview = {
    id: string;
    userId: string;
    status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'REMOVED';
    isPublic: boolean;
    reports_count: number;
};

/** Repositório em memória que imita as regras do repositório Prisma. */
export class InMemoryReports implements IReviewReportRepository {
    reports: ReviewReportRecord[] = [];
    reviews = new Map<string, FakeReview>();
    private seq = 0;

    addReview(r: Partial<FakeReview> & { id: string; userId: string }) {
        this.reviews.set(r.id, { status: 'PUBLISHED', isPublic: true, reports_count: 0, ...r });
    }

    /** Implementa só o que o caso de uso usa de IReviewRepository. */
    reviewRepo = {
        reviewById: async (id: string) => {
            const r = this.reviews.get(id);
            return r ? ({ id: r.id, userId: r.userId, status: r.status, isPublic: r.isPublic } as any) : null;
        },
    } as any;

    async create(data: ReviewReportCreateDTO): Promise<ReviewReportRecord> {
        const rec: ReviewReportRecord = {
            id: `rep-${++this.seq}`,
            reviewId: data.reviewId,
            reporterId: data.reporterId,
            reason: data.reason,
            details: data.details ?? null,
            status: 'PENDING',
            publish_attempts: 0,
            last_publish_error: null,
            created_at: new Date(),
            processed_at: null,
            resolved_at: null,
        };
        this.reports.push(rec);
        return rec;
    }

    async existsForReporter(reviewId: string, reporterId: string) {
        return this.reports.some((r) => r.reviewId === reviewId && r.reporterId === reporterId);
    }

    async registerPublishAttempt(reportId: string, error: string | null) {
        const r = this.find(reportId);
        r.publish_attempts++;
        r.last_publish_error = error;
    }

    async processReport(reportId: string, threshold: number): Promise<ProcessReportResult> {
        const report = this.reports.find((r) => r.id === reportId);
        if (!report) return { outcome: 'NOT_FOUND', reportId };
        if (report.status !== 'PENDING') return { outcome: 'ALREADY_PROCESSED', reportId, reviewId: report.reviewId };
        report.status = 'PROCESSED';
        report.processed_at = new Date();

        const review = this.reviews.get(report.reviewId)!;
        const open = this.reports.filter((r) => r.reviewId === report.reviewId && r.status === 'PROCESSED').length;
        review.reports_count = open;
        const hide = open >= threshold && review.status === 'PUBLISHED';
        if (hide) review.status = 'HIDDEN';
        return { outcome: hide ? 'HIDDEN' : 'COUNTED', reportId, reviewId: report.reviewId, openReports: open };
    }

    async listPending(olderThan: Date, limit: number) {
        return this.reports.filter((r) => r.status === 'PENDING' && r.created_at <= olderThan).slice(0, limit);
    }

    async listByStatus(status: ReportStatusType | undefined) {
        return this.reports.filter((r) => !status || r.status === status);
    }

    async moderationQueue() {
        return [];
    }

    async decide(reviewId: string, decision: ModerationDecision) {
        const review = this.reviews.get(reviewId)!;
        review.status = decision === 'KEEP' ? 'PUBLISHED' : 'REMOVED';
        review.reports_count = 0;
        let resolved = 0;
        for (const r of this.reports) {
            if (r.reviewId === reviewId && (r.status === 'PENDING' || r.status === 'PROCESSED')) {
                r.status = decision === 'KEEP' ? 'DISMISSED' : 'ACCEPTED';
                resolved++;
            }
        }
        return { reviewId, status: review.status, resolvedReports: resolved };
    }

    async stats() {
        return {
            reports: { PENDING: 0, PROCESSED: 0, ACCEPTED: 0, DISMISSED: 0 },
            reviews: { hidden: 0, removed: 0, publishedWithOpenReports: 0 },
        };
    }

    find(id: string) {
        const r = this.reports.find((x) => x.id === id);
        if (!r) throw new Error(`report ${id} não existe`);
        return r;
    }
}

/** "Broker" em memória: guarda as mensagens publicadas; pode simular indisponibilidade. */
export class FakeBroker implements IMessagePublisher {
    published: { routingKey: string; message: any; options: PublishOptions }[] = [];
    down = false;

    async publish(routingKey: string, message: object, options: PublishOptions) {
        if (this.down) throw new Error('connect ECONNREFUSED 127.0.0.1:5672');
        this.published.push({ routingKey, message, options });
    }

    /** Entrega as mensagens para um consumidor, como o RabbitMQ faria. */
    drainTo(consume: (raw: string) => Promise<unknown>) {
        const msgs = this.published.splice(0);
        return Promise.all(msgs.map((m) => consume(JSON.stringify(m.message))));
    }
}
