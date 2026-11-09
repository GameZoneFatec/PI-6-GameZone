import { ErrorApp } from './erro-app';

export class ErrorForbidden extends ErrorApp {
    constructor(msgText?: string) {
        super(msgText ?? 'Acesso negado', 403);
    }
}
