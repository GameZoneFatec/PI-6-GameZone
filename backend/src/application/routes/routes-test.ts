import { Router } from 'express';
import { makeControllers } from '../../factories/make-Controllers';
import { authMiddleware } from '../../factories/make-auth';

class teste {
    public routes = Router();
    private controller = makeControllers().teste;

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        // Ativa premium sem pagamento (rota de teste): restrita a administradores
        this.routes.post('/', authMiddleware.auth, authMiddleware.admin, this.controller.Stest);
    }
}

export default new teste().routes;
