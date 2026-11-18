import { Request, Response } from 'express';
import {
    GameAdminCreateUsecase,
    GameAdminDeleteUsecase,
    GameAdminListUsecase,
    GameAdminUpdateUsecase,
} from '../core/useCases/games/game-admin.usecases';

export class AdminGameController {
    constructor(
        private listUC: GameAdminListUsecase,
        private createUC: GameAdminCreateUsecase,
        private updateUC: GameAdminUpdateUsecase,
        private deleteUC: GameAdminDeleteUsecase,
    ) {}

    list = async (req: Request, res: Response) => {
        const { search, page, limit } = req.query;
        res.status(200).json(await this.listUC.execute(search, page, limit));
    };

    create = async (req: Request, res: Response) => {
        res.status(201).json(await this.createUC.execute(req.body));
    };

    update = async (req: Request<{ id: string }>, res: Response) => {
        res.status(200).json(await this.updateUC.execute(req.params.id, req.body));
    };

    remove = async (req: Request<{ id: string }>, res: Response) => {
        res.status(200).json(await this.deleteUC.execute(req.params.id));
    };
}
