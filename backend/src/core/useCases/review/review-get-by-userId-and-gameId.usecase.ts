import { IReviewRepository } from '../../../adapters/Repositories/Ireview-repository';

export class reviewGetByUserIdAndGameId {
    constructor(private reviewRepo: IReviewRepository) {}

    async execute(userId: string, gameId: number) {
        return await this.reviewRepo.reviewByIdGamdAndUser(userId, gameId);
    }
}
