import { IGameRepository } from '../../../adapters/Repositories/Igame-repository';
import { IUserRepository } from '../../../adapters/Repositories/Iuser-repository';
import { VerifyUserService } from '../../../application/Services/user/verify-user.service';

export class CreateFavoriteUsecase {
    constructor(
        private userRepo: IUserRepository,
        private gameRepo: IGameRepository,
        private verifyUser: VerifyUserService,
    ) {}

    async execute(gameId: number, userId: string) {
        this.verifyUser.VerifyId(userId);

        const game = await this.gameRepo.getById(String(gameId));

        const att = await this.userRepo.update(
            {
                userId: userId,
                favorite_GameId: gameId,
                favorite_name: game.name,
                favorite_url: game.background_image,
            },
            userId,
        );

        return att;
    }
}
