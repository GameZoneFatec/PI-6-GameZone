import { ErrorApp } from './erro-app';

export class ErrorConflitct extends ErrorApp {
    constructor(details: unknown, msgText?: string) {
        const message = msgText ?? 'Conflito de dados';
        super(message, 409, details);
    }
}
