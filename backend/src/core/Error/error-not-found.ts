import { ErrorApp } from './erro-app';

export class ErrorNotFound extends ErrorApp {
    constructor(message: string) {
        super(message, 404);
    }
}
