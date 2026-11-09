import { ErrorApp } from './erro-app';

export class ErroBusinessRules extends ErrorApp {
    constructor(details: any, msg?: string) {
        const message = msg ?? 'Erro na regra de negócio';
        super(message, 422, details);
    }
}
