import {
    ModerationDecision,
    ModerationQueueItem,
    ModerationStats,
    ProcessReportResult,
    ReportStatusType,
    ReviewReportCreateDTO,
    ReviewReportRecord,
} from '../../core/Entities/review-report-entity';

export interface IReviewReportRepository {
    create(data: ReviewReportCreateDTO): Promise<ReviewReportRecord>;
    existsForReporter(reviewId: string, reporterId: string): Promise<boolean>;
    registerPublishAttempt(reportId: string, error: string | null): Promise<void>;

    /** Executado pelo worker. Idempotente: só processa denúncias ainda PENDING. */
    processReport(reportId: string, threshold: number): Promise<ProcessReportResult>;

    listPending(olderThan: Date, limit: number): Promise<ReviewReportRecord[]>;
    listByStatus(status: ReportStatusType | undefined, page: number, limit: number): Promise<ReviewReportRecord[]>;
    moderationQueue(status: 'HIDDEN' | 'PUBLISHED' | 'REMOVED', page: number, limit: number): Promise<ModerationQueueItem[]>;
    decide(
        reviewId: string,
        decision: ModerationDecision,
        adminId: string,
    ): Promise<{ reviewId: string; status: string; resolvedReports: number }>;
    stats(): Promise<Omit<ModerationStats, 'threshold'>>;
}
