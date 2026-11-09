import { Request, Response } from 'express';

import { ErrorBadRequest } from '../core/Error/error-bad-request';
import { GameListUseCase } from '../core/useCases/games/game-list.usecase';
import { GameGetGenresUseCase } from '../core/useCases/games/game-get-genres.usecase';
import { GameGetByIdUseCase } from '../core/useCases/games/game-get-by-id.usecase';

export class GameController {
    constructor(
        private readonly listUseCase: GameListUseCase,
        private readonly genres: GameGetGenresUseCase,
        private readonly gameById: GameGetByIdUseCase,
    ) {}

    ListOfGame = async (req: Request, res: Response): Promise<Response> => {
        const pageNumber = (req.query.page as string) ?? '1';
        const pageSizeNumber = (req.query.pageSize as string) ?? '10';
        const search = (req.query.search as string) || null || undefined;
        const genre = (req.query.genre as string) || null || undefined;

        const games = await this.listUseCase.execute(pageNumber, pageSizeNumber, search, genre);

        return res.status(200).json(games);
    };

    ListGenre = async (req: Request, res: Response): Promise<Response> => {
        const genres = await this.genres.execute();
        return res.status(200).json(genres);
    };

    GameById = async (req: Request<any, any, any, { gameId: string; userId: string }>, res: Response): Promise<Response> => {
        const { gameId, userId } = req.query;
        if (!gameId) throw new ErrorBadRequest('Faltando passar o gameId');
        const idGame = Number(gameId);
        if (Number.isNaN(idGame)) {
            throw new ErrorBadRequest('gameId precisa ser um número');
        }

        const game = await this.gameById.execute(gameId, userId);

        return res.status(200).json(game);
    };
}
