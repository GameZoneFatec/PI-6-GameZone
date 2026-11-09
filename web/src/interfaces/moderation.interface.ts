export type ReportReason = 'OFFENSIVE' | 'SPAM' | 'SPOILER' | 'OTHER';
export type ReportStatus = 'PENDING' | 'PROCESSED' | 'ACCEPTED' | 'DISMISSED';
export type ModerationReviewStatus = 'HIDDEN' | 'PUBLISHED' | 'REMOVED';
export type ModerationDecision = 'KEEP' | 'REMOVE';

export const REASON_LABEL: Record<ReportReason, string> = {
  OFFENSIVE: 'Ofensivo',
  SPAM: 'Spam',
  SPOILER: 'Spoiler',
  OTHER: 'Outro'
};

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: 'Aguardando worker',
  PROCESSED: 'Contabilizada',
  ACCEPTED: 'Aceita (removida)',
  DISMISSED: 'Descartada (mantida)'
};

export interface IModerationStats {
  reports: Record<ReportStatus, number>;
  reviews: { hidden: number; removed: number; publishedWithOpenReports: number };
  threshold: number;
}

export interface IModerationReport {
  id: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  created_at: string;
  reporter: { id: string; username: string };
}

export interface IModerationQueueItem {
  reviewId: string;
  gameId: number;
  title: string;
  body: string | null;
  rating: number | null;
  status: ModerationReviewStatus;
  reports_count: number;
  hidden_at: string | null;
  author: { id: string; username: string };
  reports: IModerationReport[];
}

export interface IReportRecord {
  id: string;
  reviewId: string;
  reporterId: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  publish_attempts: number;
  last_publish_error: string | null;
  created_at: string;
  processed_at: string | null;
  resolved_at: string | null;
}

export interface ICreateReportResponse {
  reportId: string;
  reviewId: string;
  status: 'PENDING';
  queued: boolean;
  message: string;
}
