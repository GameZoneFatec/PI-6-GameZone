import { Router } from 'express';
import { controllers } from '../../factories/controllers';
import { authMiddleware } from '../../factories/make-auth';

/** Backoffice: todas as rotas exigem JWT válido + usuário com role ADMIN. */
class RoutesAdmin {
    public routes = Router();
    private controller = controllers.adminModerationController;

    constructor() {
        this.routes.use(authMiddleware.auth, authMiddleware.admin);
        this.initRoutes();
    }

    initRoutes() {
        this.routes.get('/moderation/stats', this.controller.stats);
        this.routes.get('/moderation/reviews', this.controller.queue);
        this.routes.patch('/moderation/reviews/:reviewId', this.controller.decide);
        this.routes.get('/moderation/reports', this.controller.reports);
        this.routes.post('/moderation/reports/republish', this.controller.republishPending);
    }
}

export default new RoutesAdmin().routes;
