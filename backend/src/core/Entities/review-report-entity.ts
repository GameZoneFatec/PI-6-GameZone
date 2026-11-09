export const REPORT_REASONS = ['OFFENSIVE', 'SPAM', 'SPOILER', 'OTHER'] as const;
export type ReportReasonType = (typeof REPORT_REASONS)[number];

export type ReportStatusType = 'PENDING' | 'PROCESSED' | 'ACCEPTED' | 'DISMISSED';

export type ModerationDecision = 'KEEP' | 'REMOVE';

export type ReviewReportCreateDTO = {
    reviewId: string;
    reporterId: string;
    reason: ReportReasonType;
    details?: string | null;
};

export type ReviewReportRecord = {
    id: string;
    reviewId: string;
    reporterId: string;
    reason: ReportReasonType;
    details: string | null;
    status: ReportStatusType;
    publish_attempts: number;
    last_publish_error: string | null;
    created_at: Date;
    processed_at: Date | null;
    resolved_at: Date | null;
};

/** Contrato da mensagem publicada no RabbitMQ (routing key: review.reported). */
export type ReviewReportedMessage = {
    event: 'review.reported';
    version: 1;
    reportId: string;
    reviewId: string;
    reporterId: string;
    reason: ReportReasonType;
    occurredAt: string; // ISO-8601
};

export type ProcessReportResult =
    | { outcome: 'NOT_FOUND'; reportId: string }
    | { outcome: 'ALREADY_PROCESSED'; reportId: string; reviewId: string }
    | { outcome: 'COUNTED' | 'HIDDEN'; reportId: string; reviewId: string; openReports: number };

export type ModerationQueueItem = {
    reviewId: string;
    gameId: number;
    title: string;
    body: string | null;
    rating: number | null;
    status: string;
    reports_count: number;
    hidden_at: Date | null;
    author: { id: string; username: string };
    reports: {
        id: string;
        reason: ReportReasonType;
        details: string | null;
        status: ReportStatusType;
        created_at: Date;
        reporter: { id: string; username: string };
    }[];
};

export type ModerationStats = {
    reports: Record<ReportStatusType, number>;
    reviews: { hidden: number; removed: number; publishedWithOpenReports: number };
    threshold: number;
};
