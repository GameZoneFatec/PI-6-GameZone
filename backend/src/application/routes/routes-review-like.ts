import { Router } from 'express';
import { makeControllers } from '../../factories/make-Controllers';

class RoutesReviewLike {
    public routes = Router();
    private controller = makeControllers().reviewLikeController;

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.post('/', this.controller.create);
        this.routes.delete('/', this.controller.delete);
    }
}

export default new RoutesReviewLike().routes;
