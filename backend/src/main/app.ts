import express, { Express } from 'express';
import cors from 'cors';
import { resolve } from 'path';
import RoutesMain from '../application/routes/routes-main';
import ErrosMiddleware from '../Middleware/errors.middleware';
import { CATALOG_MEDIA_DIR, UPLOAD_MEDIA_DIR } from '../infra/config/media-config';

class App {
    public app: Express;

    constructor() {
        this.app = express();
        this.middlerwares();
        this.routes();
        this.errors();
    }

    private middlerwares() {
        this.app.use(cors());
        this.app.use(express.json({ limit: '4mb' })); // capas de jogos chegam em base64 pelo backoffice
        this.app.use('/perfil-image', express.static(resolve(__dirname, '..', '..', 'uploads', 'profile')));
        // Imagens dos jogos: catálogo importado (no Git) e capas enviadas pelo backoffice
        this.app.use('/media', express.static(CATALOG_MEDIA_DIR, { maxAge: '7d' }));
        this.app.use('/media', express.static(UPLOAD_MEDIA_DIR));
    }

    private routes() {
        this.app.use(RoutesMain);
    }

    private errors() {
        this.app.use(ErrosMiddleware.errosMiddleware);
    }
}

export default new App().app;
