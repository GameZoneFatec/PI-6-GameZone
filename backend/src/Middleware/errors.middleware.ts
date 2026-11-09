import { NextFunction, Request, Response } from 'express';
import { ErrorApp } from '../core/Error/erro-app';
import { LocalImageStorage } from '../infra/Image/Local-image-storage';

class ErrorMiddleware {
    public errosMiddleware(error: Error & ErrorApp, req: Request, res: Response, next: NextFunction) {
        if (req.file) {
            LocalImageStorage.deleteByIDImage(req.file.filename);
        }

        const statusCode = error.statusCode ?? 500;
        const message = error.statusCode ? error.message : 'Internal Server Errora';
        return res.status(statusCode).json({
            message: message,
            details: error.details,
        });
    }
}

export default new ErrorMiddleware();
