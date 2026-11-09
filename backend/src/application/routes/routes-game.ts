import { Router } from 'express';
import { controllers } from '../../factories/controllers';

class RoutesGames {
    public routes = Router();
    private controllerGame = controllers.gameController;
    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.get('/', this.controllerGame.ListOfGame);
        this.routes.get('/genres', this.controllerGame.ListGenre);
        this.routes.get('/id', this.controllerGame.GameById);
    }
}

export default new RoutesGames().routes;
