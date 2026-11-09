import { ErrorBadRequest } from '../core/Error/error-bad-request';

export class VerifyNumeric {
    static execute(value: number, desc: string) {
        if (Number.isNaN(value)) {
            throw new ErrorBadRequest(`${desc} tem que ser numérico`);
        }
    }
}
