import { Router } from 'express';
import { controllers } from '../../factories/controllers';

class RoutesAuth {
    public routes = Router();
    private controller = controllers.authController;

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.post('/verify/email', this.controller.verifyEmail);
    }
}

export default new RoutesAuth().routes;
