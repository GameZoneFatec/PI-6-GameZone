import { Request, Response } from 'express';
import { ErrorBadRequest } from '../core/Error/error-bad-request';
import { ProfileCreateDTO, ProfileUpdateDTO } from '../core/Entities/userGame-entity';
import { GameStatus } from '@prisma/client';
import { UserGameGetByIdListUseCase } from '../core/useCases/userGame/userGame-getById-list.usecase';
import { UserGameCreateUsecase } from '../core/useCases/userGame/userGame-create.usecase';
import { UserGameUpdateUsecase } from '../core/useCases/userGame/userGame-update.usecase';
import { UserGameTotalGameStatus } from '../core/useCases/userGame/userGame-total-game-status.usecase';
import { userGameDelete } from '../core/useCases/userGame/userGame-delete.usecase';
import { VerifyNumeric } from '../util/verify-numeric';
import { CreateFavoriteUsecase } from '../core/useCases/userGame/userGame-createFavorite';

export class UserGameController {
    constructor(
        private getUserProfileById: UserGameGetByIdListUseCase,
        private createProfileUC: UserGameCreateUsecase,
        private updateProfileUC: UserGameUpdateUsecase,
        private totalGameStatusUC: UserGameTotalGameStatus,
        private deleteUserGameUC: userGameDelete,
        private createFavoriteGameUC: CreateFavoriteUsecase,
    ) {}

    getProfileList = async (req: Request<any, any, any, profileList>, res: Response) => {
        if (!req.query.userId) throw new ErrorBadRequest('User id não foi passado');
        const userId = req.query.userId;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        VerifyNumeric.execute(page, 'Page');
        VerifyNumeric.execute(limit, 'Limit');
        const status = req.query.status;
        const search = req.query.search;

        const userProfile = await this.getUserProfileById.execute(userId, page, limit, status, search);
        return res.status(200).json(userProfile);
    };

    createProfile = async (req: Request, res: Response) => {
        if (!req.body) throw new ErrorBadRequest('Não foi passado o body corretamente');
        const { userId, gameId, status, note } = req.body;

        const profileCreate: ProfileCreateDTO = {
            gameId: gameId,
            userId: userId,
            status: status,
            note: note,
        };
        const profile = await this.createProfileUC.exeute(profileCreate);

        return res.status(201).json(profile);
    };

    updateProfile = async (req: Request, res: Response) => {
        if (!req.body) throw new ErrorBadRequest('Body veio vázio');
        if (!req.params) throw new ErrorBadRequest('Parâmetro do ID não foi passado corretamente');
        const { status, note } = req.body;
        const { profileId } = req.params;

        const data = {
            profileId,
            status,
            note,
        } as ProfileUpdateDTO;

        const updateProfile = await this.updateProfileUC.execute(data);

        return res.status(200).json({
            message: 'Atualizado com sucesso!',
            ...updateProfile,
        });
    };

    deleteUserProfile = async (req: Request, res: Response) => {
        const { gameProfileId } = req.params;
        if (!gameProfileId) throw new ErrorBadRequest('ID do perfil não foi passado corretamente');
        await this.deleteUserGameUC.execute(gameProfileId);

        return res.status(200).json({ message: 'Deletado com sucesso!' });
    };

    totalGameStatusGame = async (req: Request<any, any, any, { gameId: number }>, res: Response) => {
        const { gameId } = req.query;
        if (!gameId) throw new ErrorBadRequest('ID do jogo não foi passado');
        VerifyNumeric.execute(gameId, 'gameId');

        const out = await this.totalGameStatusUC.execute(Number(gameId));

        res.status(200).json(out);
    };

    totalGameStatusUser = async (req: Request<any, any, any, { userId: string }>, res: Response) => {
        const { userId } = req.query;
        if (!userId) throw new ErrorBadRequest('ID do usuáiro não foi passado corretamente');

        const out = await this.totalGameStatusUC.execute(undefined, userId);

        res.status(200).json(out);
    };

    createFavoriteGame = async (req: Request, res: Response) => {
        const { gameId, userId } = req.body;

        const out = await this.createFavoriteGameUC.execute(gameId, userId);

        res.status(201).json(out);
    };
}

interface profileList {
    userId: string;
    page: number;
    limit: number;
    status: GameStatus;
    search: string;
}
