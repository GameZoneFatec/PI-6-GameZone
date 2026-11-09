import { authMiddleware } from '../../factories/make-auth';
import { Router } from 'express';
import { controllers } from '../../factories/controllers';

class RoutesUserGame {
    public routes = Router();
    private userGameController = controllers.userGameController;

    constructor() {
        this.initRoutes();
    }

    private initRoutes() {
        this.routes.get('/', this.userGameController.getProfileList);
        this.routes.post('/', authMiddleware.auth, this.userGameController.createProfile);
        this.routes.put('/update/:profileId', authMiddleware.auth, this.userGameController.updateProfile);
        this.routes.delete('/delete/:gameProfileId', authMiddleware.auth, this.userGameController.deleteUserProfile);
        this.routes.get('/total/status/game', this.userGameController.totalGameStatusGame);
        this.routes.get('/total/status/user', this.userGameController.totalGameStatusUser);
        this.routes.post('/favorite/game', authMiddleware.auth, this.userGameController.createFavoriteGame);
    }
}

export default new RoutesUserGame().routes;
