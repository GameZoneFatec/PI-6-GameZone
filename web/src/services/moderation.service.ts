import { api } from './api';
import type {
  ICreateReportResponse,
  IModerationQueueItem,
  IModerationStats,
  IReportRecord,
  ModerationDecision,
  ModerationReviewStatus,
  ReportReason,
  ReportStatus
} from '@interfaces/moderation.interface';

/** Chamadas do backoffice (exigem usuário ADMIN) e da denúncia (usuário logado). */
export const moderationService = {
  async stats() {
    const { data } = await api.get<IModerationStats>('/admin/moderation/stats');
    return data;
  },

  async queue(status: ModerationReviewStatus) {
    const { data } = await api.get<IModerationQueueItem[]>('/admin/moderation/reviews', {
      params: { status, page: 1, limit: 50 }
    });
    return data;
  },

  async decide(reviewId: string, decision: ModerationDecision) {
    const { data } = await api.patch(`/admin/moderation/reviews/${reviewId}`, { decision });
    return data as { reviewId: string; status: string; resolvedReports: number };
  },

  async reports(status?: ReportStatus) {
    const { data } = await api.get<IReportRecord[]>('/admin/moderation/reports', {
      params: { status, page: 1, limit: 50 }
    });
    return data;
  },

  async republishPending() {
    const { data } = await api.post('/admin/moderation/reports/republish');
    return data as { found: number; published: number; failed: number };
  },

  async report(reviewId: string, reason: ReportReason, details?: string) {
    const { data } = await api.post<ICreateReportResponse>(`/review/${reviewId}/report`, {
      reason,
      details: details?.trim() || undefined
    });
    return data;
  }
};
