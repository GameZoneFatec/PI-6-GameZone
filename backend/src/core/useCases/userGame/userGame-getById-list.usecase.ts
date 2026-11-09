import { GameStatus } from '@prisma/client';
import { IUserGameRepository } from '../../../adapters/Repositories/IuserGame-repository';
import { VerifyUserService } from '../../../application/Services/user/verify-user.service';

export class UserGameGetByIdListUseCase {
    constructor(
        private repository: IUserGameRepository,
        private userVery: VerifyUserService,
    ) {}

    async execute(userId: string, page: number, limit: number, status?: GameStatus, search?: string) {
        this.userVery.VerifyId(userId);
        const result = await this.repository.getUserProfile(userId, page, limit, status, search);

        if (!result || !result.data || result.data.length === 0) {
            return {
                data: [],
                totalGames: 0,
                totalPage: 0,
                currentPage: page,
            };
        }

        return result;
    }
}
