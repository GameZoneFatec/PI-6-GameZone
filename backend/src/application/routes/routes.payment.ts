import { Router } from 'express';
import { makeControllers } from '../../factories/make-Controllers';

class RoutesPayment {
    public routes = Router();
    private controller = makeControllers().paymentController;

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.post('/', this.controller.createSubscription);
        this.routes.post('/webhook', this.controller.webHook);
        this.routes.get('/status/:paymentId', this.controller.paymentStatus);
    }
}

export default new RoutesPayment().routes;
