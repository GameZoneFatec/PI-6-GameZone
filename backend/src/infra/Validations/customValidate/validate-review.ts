import { ErrorBadRequest } from '../../../core/Error/error-bad-request';
import { ReviewCreateDTO, ReviewUpdateDTO } from '../../../core/Entities/review-entity';
import { ErroBusinessRules } from '../../../core/Error/error-business-rules';

export class ValidateReview {
    static validateCreate(data: ReviewCreateDTO) {
        this.validar(data);
    }

    static validateUpdate(data: ReviewUpdateDTO) {
        this.validar(data, true);
    }

    private static validar(data: any, update?: boolean) {
        const texts: string[] = [];
        if (!update) {
            if (data.userId.length == 0) texts.push('userId não foi passado');
            if (data.gameId == 0 || data.gameId == undefined) texts.push('GameId não foi passado');
            if (isNaN(Number(data.gameId))) throw new ErrorBadRequest('gameId tem que ser numérico');
        }

        if (data.title || data.title == '') {
            if (data.title.length == 0) texts.push('Título não pode estar vazio');
        }

        if (data.rating) {
            if (isNaN(Number(data.rating))) throw new ErrorBadRequest('rating tem que ser um numérico');
            if (data.rating <= 0 || data.rating > 5) throw new ErroBusinessRules('Rating não pode ser igual a zero ou maior que cinco ');
        }

        if (data.status) {
            if (!['PUBLISHED', 'DRAFT'].includes(data.status)) texts.push('Parâmetro passado para status não é válido');
        }

        const details = texts.map((fields: any) => ({ fields }));
        if (details.length > 0) {
            throw new ErrorBadRequest('Erro na validação dos dados', details);
        }
    }
}
