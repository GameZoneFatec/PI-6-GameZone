import { IGameRepository } from '../../../adapters/Repositories/Igame-repository';
import { IUserGameRepository } from '../../../adapters/Repositories/IuserGame-repository';
import { VerifyUserService } from '../../../application/Services/user/verify-user.service';

export class GameGetByIdUseCase {
    constructor(
        private repository: IGameRepository,
        private VerifyUser: VerifyUserService,
        private userGameRepo: IUserGameRepository,
    ) {}

    async execute(gameId: string, userId?: string) {
        const games = await this.repository.getById(gameId);
        // Sem usuário (visitante ou app sem login) só devolve o jogo
        const userGame = userId ? await this.userGameRepo.UserGameByUserId(Number(gameId), userId) : null;
        let status = null;
        let userGameId = null;
        if (userGame) {
            status = userGame.status;
            userGameId = userGame.id;
        }

        const out = {
            userGame: {
                userGameId,
                status,
            },
            game: games,
        };

        return out;
    }
}
