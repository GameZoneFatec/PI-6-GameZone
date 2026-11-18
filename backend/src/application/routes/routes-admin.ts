import { Router } from 'express';
import { controllers } from '../../factories/controllers';
import { authMiddleware } from '../../factories/make-auth';

/** Backoffice: todas as rotas exigem JWT válido + usuário com role ADMIN. */
class RoutesAdmin {
    public routes = Router();
    private controller = controllers.adminModerationController;
    private games = controllers.adminGameController;

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

        // Catálogo de jogos (API própria de jogos)
        this.routes.get('/games', this.games.list);
        this.routes.post('/games', this.games.create);
        this.routes.put('/games/:id', this.games.update);
        this.routes.delete('/games/:id', this.games.remove);
    }
}

export default new RoutesAdmin().routes;
