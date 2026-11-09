import { ErrorApp } from './erro-app';

export class ErrorUnauthorized extends ErrorApp {
    constructor(msgText: string) {
        super(msgText, 401);
    }
}
