import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewReportCreateUsecase } from '../src/core/useCases/reviewReport/review-report-create.usecase';
import { InvalidMessageError, ReviewReportProcessUsecase } from '../src/core/useCases/reviewReport/review-report-process.usecase';
import { ModerationDecideUsecase, ModerationRepublishPendingUsecase } from '../src/core/useCases/moderation/moderation.usecases';
import { FakeBroker, InMemoryReports } from './fakes';

const THRESHOLD = 3;

describe('Fluxo de denúncia de análise', () => {
    let repo: InMemoryReports;
    let broker: FakeBroker;
    let createReport: ReviewReportCreateUsecase;
    let worker: ReviewReportProcessUsecase;

    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        repo = new InMemoryReports();
        broker = new FakeBroker();
        createReport = new ReviewReportCreateUsecase(repo, repo.reviewRepo, broker);
        worker = new ReviewReportProcessUsecase(repo, THRESHOLD);
        repo.addReview({ id: 'review-1', userId: 'autor' });
    });

    describe('caminho principal', () => {
        it('grava a denúncia como PENDING e publica review.reported com o id da denúncia', async () => {
            const out = await createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'spam' });

            expect(out).toMatchObject({ status: 'PENDING', queued: true });
            expect(repo.find(out.reportId).status).toBe('PENDING');
            expect(broker.published).toHaveLength(1);
            expect(broker.published[0]).toMatchObject({
                routingKey: 'review.reported',
                options: { messageId: out.reportId },
                message: { event: 'review.reported', version: 1, reportId: out.reportId, reviewId: 'review-1', reason: 'SPAM' },
            });
        });

        it('worker conta as denúncias e oculta a análise ao atingir o limite', async () => {
            for (const u of ['u1', 'u2']) await createReport.execute({ reviewId: 'review-1', reporterId: u, reason: 'OFFENSIVE' });
            const [r1, r2] = await broker.drainTo((raw) => worker.execute(raw));

            expect(r1).toMatchObject({ outcome: 'COUNTED', openReports: 1 });
            expect(r2).toMatchObject({ outcome: 'COUNTED', openReports: 2 });
            expect(repo.reviews.get('review-1')!.status).toBe('PUBLISHED');

            await createReport.execute({ reviewId: 'review-1', reporterId: 'u3', reason: 'OFFENSIVE' });
            const [r3] = await broker.drainTo((raw) => worker.execute(raw));

            expect(r3).toMatchObject({ outcome: 'HIDDEN', openReports: 3 });
            expect(repo.reviews.get('review-1')!.status).toBe('HIDDEN');
        });

        it('admin mantém a análise: volta a PUBLISHED e as denúncias ficam DISMISSED', async () => {
            for (const u of ['u1', 'u2', 'u3']) await createReport.execute({ reviewId: 'review-1', reporterId: u, reason: 'SPAM' });
            await broker.drainTo((raw) => worker.execute(raw));

            const out = await new ModerationDecideUsecase(repo).execute('review-1', 'KEEP', 'admin-1');

            expect(out).toMatchObject({ status: 'PUBLISHED', resolvedReports: 3 });
            expect(repo.reports.every((r) => r.status === 'DISMISSED')).toBe(true);
            expect(repo.reviews.get('review-1')!.reports_count).toBe(0);
        });
    });

    describe('entradas inválidas', () => {
        it('rejeita motivo fora da lista', async () => {
            await expect(createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'CHATO' })).rejects.toMatchObject({
                statusCode: 400,
            });
            expect(broker.published).toHaveLength(0);
        });

        it('exige descrição quando o motivo é OTHER', async () => {
            await expect(createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'OTHER' })).rejects.toMatchObject({
                statusCode: 400,
            });
        });

        it('não permite denunciar a própria análise', async () => {
            await expect(createReport.execute({ reviewId: 'review-1', reporterId: 'autor', reason: 'SPAM' })).rejects.toMatchObject({
                statusCode: 422,
            });
        });

        it('não permite denunciar a mesma análise duas vezes', async () => {
            await createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'SPAM' });
            await expect(createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'SPAM' })).rejects.toMatchObject({
                statusCode: 409,
            });
        });

        it('retorna 404 para análise inexistente', async () => {
            await expect(createReport.execute({ reviewId: 'nao-existe', reporterId: 'u1', reason: 'SPAM' })).rejects.toMatchObject({
                statusCode: 404,
            });
        });

        it('rejeita decisão de moderação inválida', async () => {
            await expect(new ModerationDecideUsecase(repo).execute('review-1', 'APAGAR', 'admin-1')).rejects.toMatchObject({
                statusCode: 400,
            });
        });

        it('worker descarta mensagem fora do contrato (vai para a DLQ)', async () => {
            await expect(worker.execute('isto não é json')).rejects.toBeInstanceOf(InvalidMessageError);
            await expect(worker.execute(JSON.stringify({ event: 'outro' }))).rejects.toBeInstanceOf(InvalidMessageError);
        });
    });

    describe('falhas da integração assíncrona', () => {
        it('broker fora do ar: denúncia não se perde, fica PENDING com o erro registrado', async () => {
            broker.down = true;

            const out = await createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'SPAM' });

            expect(out).toMatchObject({ status: 'PENDING', queued: false });
            const saved = repo.find(out.reportId);
            expect(saved.status).toBe('PENDING');
            expect(saved.publish_attempts).toBe(1);
            expect(saved.last_publish_error).toContain('ECONNREFUSED');
        });

        it('broker volta: o backoffice republica as pendentes e o worker processa', async () => {
            broker.down = true;
            const out = await createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'SPAM' });
            broker.down = false;

            const republish = new ModerationRepublishPendingUsecase(repo, broker, 0);
            expect(await republish.execute()).toEqual({ found: 1, published: 1, failed: 0 });

            await broker.drainTo((raw) => worker.execute(raw));
            expect(repo.find(out.reportId).status).toBe('PROCESSED');
            expect(repo.reviews.get('review-1')!.reports_count).toBe(1);
        });

        it('mensagem duplicada não conta duas vezes (idempotência)', async () => {
            await createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'SPAM' });
            const raw = JSON.stringify(broker.published[0]!.message);

            expect(await worker.execute(raw)).toMatchObject({ outcome: 'COUNTED', openReports: 1 });
            expect(await worker.execute(raw)).toMatchObject({ outcome: 'ALREADY_PROCESSED' });
            expect(repo.reviews.get('review-1')!.reports_count).toBe(1);
        });

        it('mensagem que chega depois da decisão do admin é ignorada', async () => {
            await createReport.execute({ reviewId: 'review-1', reporterId: 'u1', reason: 'SPAM' });
            await new ModerationDecideUsecase(repo).execute('review-1', 'REMOVE', 'admin-1');

            const [result] = await broker.drainTo((raw) => worker.execute(raw));

            expect(result).toMatchObject({ outcome: 'ALREADY_PROCESSED' });
            expect(repo.reviews.get('review-1')!.status).toBe('REMOVED');
        });
    });
});
