import { Prisma, PrismaClient, ReportStatus, ReviewStatus } from '@prisma/client';
import { IReviewReportRepository } from '../../../../adapters/Repositories/Ireview-report-repository';
import {
    ModerationDecision,
    ModerationQueueItem,
    ModerationStats,
    ProcessReportResult,
    ReportStatusType,
    ReviewReportCreateDTO,
    ReviewReportRecord,
} from '../../../../core/Entities/review-report-entity';
import { ErrorConflitct } from '../../../../core/Error/error-conflict';
import { ErrorNotFound } from '../../../../core/Error/error-not-found';
import { ErroBusinessRules } from '../../../../core/Error/error-business-rules';

export class ReviewReportRepoPrisma implements IReviewReportRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: ReviewReportCreateDTO): Promise<ReviewReportRecord> {
        try {
            return await this.prisma.reviewReport.create({
                data: {
                    reviewId: data.reviewId,
                    reporterId: data.reporterId,
                    reason: data.reason,
                    details: data.details ?? null,
                },
            });
        } catch (err) {
            // Duas requisições simultâneas do mesmo usuário: a constraint única resolve.
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ErrorConflitct(null, 'Você já denunciou esta análise');
            }
            throw err;
        }
    }

    async existsForReporter(reviewId: string, reporterId: string): Promise<boolean> {
        const found = await this.prisma.reviewReport.findUnique({
            where: { review_reporter_unique: { reviewId, reporterId } },
            select: { id: true },
        });
        return !!found;
    }

    async registerPublishAttempt(reportId: string, error: string | null): Promise<void> {
        await this.prisma.reviewReport.update({
            where: { id: reportId },
            data: { publish_attempts: { increment: 1 }, last_publish_error: error },
        });
    }

    async processReport(reportId: string, threshold: number): Promise<ProcessReportResult> {
        return this.prisma.$transaction(async (tx) => {
            const report = await tx.reviewReport.findUnique({ where: { id: reportId }, select: { reviewId: true } });
            if (!report) return { outcome: 'NOT_FOUND', reportId };

            // Marca como processada só se ainda estiver PENDING (operação atômica).
            // Mensagem duplicada → count = 0 → nada muda (idempotência).
            const marked = await tx.reviewReport.updateMany({
                where: { id: reportId, status: 'PENDING' },
                data: { status: 'PROCESSED', processed_at: new Date() },
            });
            if (marked.count === 0) return { outcome: 'ALREADY_PROCESSED', reportId, reviewId: report.reviewId };

            const openReports = await tx.reviewReport.count({ where: { reviewId: report.reviewId, status: 'PROCESSED' } });
            const review = await tx.review.findUniqueOrThrow({ where: { id: report.reviewId }, select: { status: true } });
            const hide = openReports >= threshold && review.status === 'PUBLISHED';

            await tx.review.update({
                where: { id: report.reviewId },
                data: {
                    reports_count: openReports,
                    ...(hide ? { status: 'HIDDEN', hidden_at: new Date() } : {}),
                },
            });

            return { outcome: hide ? 'HIDDEN' : 'COUNTED', reportId, reviewId: report.reviewId, openReports };
        });
    }

    async listPending(olderThan: Date, limit: number): Promise<ReviewReportRecord[]> {
        return this.prisma.reviewReport.findMany({
            where: { status: 'PENDING', created_at: { lte: olderThan } },
            orderBy: { created_at: 'asc' },
            take: limit,
        });
    }

    async listByStatus(status: ReportStatusType | undefined, page: number, limit: number): Promise<ReviewReportRecord[]> {
        return this.prisma.reviewReport.findMany({
            where: status ? { status: status as ReportStatus } : {},
            orderBy: { created_at: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async moderationQueue(status: 'HIDDEN' | 'PUBLISHED' | 'REMOVED', page: number, limit: number): Promise<ModerationQueueItem[]> {
        const reviews = await this.prisma.review.findMany({
            where: {
                status: status as ReviewStatus,
                // Publicadas só aparecem se tiverem denúncias abertas
                ...(status === 'PUBLISHED' ? { reports_count: { gt: 0 } } : {}),
            },
            orderBy: [{ hidden_at: 'desc' }, { reports_count: 'desc' }, { updated_at: 'desc' }],
            skip: (page - 1) * limit,
            take: limit,
            include: {
                author: { select: { id: true, username: true } },
                reports: {
                    orderBy: { created_at: 'desc' },
                    include: { reporter: { select: { id: true, username: true } } },
                },
            },
        });

        return reviews.map((r) => ({
            reviewId: r.id,
            gameId: r.gameId,
            title: r.title,
            body: r.body,
            rating: r.rating,
            status: r.status,
            reports_count: r.reports_count,
            hidden_at: r.hidden_at,
            author: r.author,
            reports: r.reports.map((rep) => ({
                id: rep.id,
                reason: rep.reason,
                details: rep.details,
                status: rep.status,
                created_at: rep.created_at,
                reporter: rep.reporter,
            })),
        }));
    }

    async decide(reviewId: string, decision: ModerationDecision, adminId: string) {
        return this.prisma.$transaction(async (tx) => {
            const review = await tx.review.findUnique({ where: { id: reviewId }, select: { status: true, reports_count: true } });
            if (!review) throw new ErrorNotFound('Análise não encontrada');

            const moderatable = review.status === 'HIDDEN' || (review.status === 'PUBLISHED' && review.reports_count > 0);
            if (!moderatable) throw new ErroBusinessRules(null, 'Esta análise não está aguardando moderação');

            const now = new Date();
            const newStatus: ReviewStatus = decision === 'KEEP' ? 'PUBLISHED' : 'REMOVED';
            const reportStatus: ReportStatus = decision === 'KEEP' ? 'DISMISSED' : 'ACCEPTED';

            // Resolve também denúncias ainda PENDING: se a mensagem chegar depois, o worker a ignora.
            const resolved = await tx.reviewReport.updateMany({
                where: { reviewId, status: { in: ['PENDING', 'PROCESSED'] } },
                data: { status: reportStatus, resolved_at: now },
            });

            await tx.review.update({
                where: { id: reviewId },
                data: {
                    status: newStatus,
                    reports_count: 0,
                    moderated_at: now,
                    moderated_by_id: adminId,
                    ...(decision === 'KEEP' ? { hidden_at: null } : {}),
                },
            });

            return { reviewId, status: newStatus, resolvedReports: resolved.count };
        });
    }

    async stats(): Promise<Omit<ModerationStats, 'threshold'>> {
        const [grouped, hidden, removed, publishedWithOpenReports] = await Promise.all([
            this.prisma.reviewReport.groupBy({ by: ['status'], _count: { _all: true } }),
            this.prisma.review.count({ where: { status: 'HIDDEN' } }),
            this.prisma.review.count({ where: { status: 'REMOVED' } }),
            this.prisma.review.count({ where: { status: 'PUBLISHED', reports_count: { gt: 0 } } }),
        ]);

        const reports: Record<ReportStatusType, number> = { PENDING: 0, PROCESSED: 0, ACCEPTED: 0, DISMISSED: 0 };
        for (const g of grouped) reports[g.status] = g._count._all;

        return { reports, reviews: { hidden, removed, publishedWithOpenReports } };
    }
}
