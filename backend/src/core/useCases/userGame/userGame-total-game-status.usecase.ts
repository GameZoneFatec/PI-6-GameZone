import { IUserGameRepository } from '../../../adapters/Repositories/IuserGame-repository';
import { VerifyUserService } from '../../../application/Services/user/verify-user.service';

export class UserGameTotalGameStatus {
    constructor(
        private repository: IUserGameRepository,
        private verify: VerifyUserService,
    ) {}

    async execute(gameId?: number, userId?: string) {
        if (gameId) {
            return await this.repository.totalGameStatusGame(gameId);
        } else if (userId) {
            await this.verify.VerifyId(userId);
            return await this.repository.totalGameStatusUser(userId);
        }
    }
}
