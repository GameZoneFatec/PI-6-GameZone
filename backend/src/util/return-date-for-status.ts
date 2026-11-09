import { ReviewStatus } from '@prisma/client';

export class DateForStatus {
    static execute(status: ReviewStatus): any {
        if (status == 'PUBLISHED') return new Date() ?? null;
    }
}
