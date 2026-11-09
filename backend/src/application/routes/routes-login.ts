import { Router } from 'express';
import { controllers } from '../../factories/controllers';

export class RoutesLogin {
    public routes = Router();
    private LoginController = controllers.loginController;
    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.post('/', this.LoginController.Login);
    }
}

export default new RoutesLogin().routes;
