import { Request, Response, Router } from 'express';
import RoutesUser from './routes-user';
import RoutesLogin from './routes-login';
import RoutesGames from './routes-game';
import RoutesProfile from './routes-userGame';
import RoutesReview from './routes-review';
import routesReviewLike from './routes-review-like';
import routesPayment from './routes.payment';
import routesAuth from './routes-auth';
import routesTest from './routes-test';
import routesAdmin from './routes-admin';

class MainRoutes {
    public routes = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.use('/users', RoutesUser);
        this.routes.use('/login', RoutesLogin);
        this.routes.use('/games', RoutesGames);
        this.routes.use('/profile', RoutesProfile);
        this.routes.use('/review', RoutesReview);
        this.routes.use('/reviewLike', routesReviewLike);
        this.routes.use('/payment', routesPayment);
        this.routes.use('/auth', routesAuth);
        this.routes.use('/teste', routesTest);
        this.routes.use('/admin', routesAdmin);
    }
}

export default new MainRoutes().routes;
