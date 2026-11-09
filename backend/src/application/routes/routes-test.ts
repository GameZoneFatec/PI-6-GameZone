import { Router } from 'express';
import { makeControllers } from '../../factories/make-Controllers';

class teste {
    public routes = Router();
    private controller = makeControllers().teste;

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.post('/', this.controller.Stest);
    }
}

export default new teste().routes;
