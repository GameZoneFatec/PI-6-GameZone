import { Router } from 'express';
import { makeControllers } from '../../factories/make-Controllers';
import { ValidateRequest } from '../../Middleware/validate-body.middleware';
import { createBodyMandatory, updateBody } from '../../core/Entities/review-entity';

class RoutesReview {
    public routes = Router();
    private controller = makeControllers().reviewController;

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.routes.post('/', ValidateRequest.validateBody([], createBodyMandatory), this.controller.create);
        this.routes.put('/update/:reviewId', ValidateRequest.validateBody(updateBody), this.controller.update);
        this.routes.delete("/:reviewId", this.controller.delete)
        this.routes.get('/:reviewId', this.controller.getById);
        this.routes.get('/user/game', this.controller.getByUserIdAndGameId)
        this.routes.get('/list/feed', this.controller.listFeed);
        this.routes.get('/list/user/:userId', this.controller.listUser);
    }
}

export default new RoutesReview().routes;
