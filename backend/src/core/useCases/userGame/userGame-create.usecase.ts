import { IGameRepository } from '../../../adapters/Repositories/Igame-repository';
import { IUserGameRepository } from '../../../adapters/Repositories/IuserGame-repository';
import { VerifyUserService } from '../../../application/Services/user/verify-user.service';
import { ProfileCreateDTO } from '../../Entities/userGame-entity';
import { ErrorBadRequest } from '../../Error/error-bad-request';
import { ErrorConflitct } from '../../Error/error-conflict';

export class UserGameCreateUsecase {
    constructor(
        private repository: IUserGameRepository,
        private verifyUser: VerifyUserService,
        private gameRepo: IGameRepository,
    ) {}

    async exeute(data: ProfileCreateDTO) {
        const { gameId, userId } = data;

        await this.verifyUser.VerifyId(userId);
        this.validate(data);
        const exist = await this.repository.VerifyGameWithUser(userId, gameId);
        if (exist) throw new ErrorConflitct('O jogo já está cadastrado nesse perfil');

        const game = await this.gameRepo.getById(String(gameId)).catch((err: any) => {
            if (err.statusCode == 404) throw new ErrorBadRequest('ID do jogo não cadastrado');
        });
        if (game) data.gameName = game.name;
        const profileCreate = await this.repository.createUserProfile(data);

        return profileCreate;
    }

    validate(data: ProfileCreateDTO) {
        if (!['BACKLOG', 'PLAYING', 'FINISHED', 'DROPPED'].includes(data.status))
            throw new ErrorBadRequest('Parâmetro de status não é valido');
    }
}
