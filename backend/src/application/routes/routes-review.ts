import { Router } from 'express';
import { controllers } from '../../factories/controllers';
import { authMiddleware } from '../../factories/make-auth';
import { ValidateRequest } from '../../Middleware/validate-body.middleware';
import { createBodyMandatory, updateBody } from '../../core/Entities/review-entity';

class RoutesReview {
    public routes = Router();
    private controller = controllers.reviewController;
    private reportController = controllers.reviewReportController;
    private auth = authMiddleware.auth;

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.post('/', this.auth, ValidateRequest.validateBody([], createBodyMandatory), this.controller.create);
        this.routes.put('/update/:reviewId', this.auth, ValidateRequest.validateBody(updateBody), this.controller.update);
        this.routes.delete('/:reviewId', this.auth, this.controller.delete);
        this.routes.post('/:reviewId/report', this.auth, this.reportController.create);
        this.routes.get('/:reviewId', this.controller.getById);
        this.routes.get('/user/game', this.controller.getByUserIdAndGameId);
        this.routes.get('/list/feed', this.controller.listFeed);
        this.routes.get('/list/user/:userId', this.controller.listUser);
    }
}

export default new RoutesReview().routes;
