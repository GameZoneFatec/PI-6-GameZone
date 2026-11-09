import { IReviewReportRepository } from '../../../adapters/Repositories/Ireview-report-repository';
import { ProcessReportResult, ReviewReportedMessage } from '../../Entities/review-report-entity';

export class InvalidMessageError extends Error {}

/**
 * Executado pelo WORKER ao consumir "review.reported".
 * Conta a denúncia e, ao atingir o limite, oculta a análise (status HIDDEN),
 * que passa a aparecer na fila de moderação do backoffice.
 */
export class ReviewReportProcessUsecase {
    constructor(
        private reportRepo: IReviewReportRepository,
        private threshold: number,
    ) {}

    async execute(raw: string): Promise<ProcessReportResult> {
        const message = this.parse(raw);
        const result = await this.reportRepo.processReport(message.reportId, this.threshold);

        const tag = `[report:${message.reportId}]`;
        switch (result.outcome) {
            case 'NOT_FOUND':
                console.warn(`${tag} denúncia não existe mais no banco; mensagem descartada`);
                break;
            case 'ALREADY_PROCESSED':
                console.log(`${tag} já processada anteriormente (mensagem duplicada); ignorada`);
                break;
            case 'COUNTED':
                console.log(`${tag} contabilizada: review ${result.reviewId} tem ${result.openReports}/${this.threshold} denúncias`);
                break;
            case 'HIDDEN':
                console.log(`${tag} review ${result.reviewId} OCULTADA (${result.openReports} denúncias) → fila de moderação`);
                break;
        }
        return result;
    }

    private parse(raw: string): ReviewReportedMessage {
        let data: any;
        try {
            data = JSON.parse(raw);
        } catch {
            throw new InvalidMessageError('Mensagem não é um JSON válido');
        }
        if (data?.event !== 'review.reported' || typeof data.reportId !== 'string' || !data.reportId) {
            throw new InvalidMessageError('Mensagem fora do contrato review.reported v1');
        }
        return data as ReviewReportedMessage;
    }
}
