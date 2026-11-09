import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import { extname, resolve } from 'path';
import { v4 } from 'uuid';

const uploadDir = resolve(__dirname, '..', '..', '..', '..', 'uploads', 'profile');
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadDir,
    filename(req, file, callback) {
        return callback(null, v4() + extname(file.originalname));
    },
});

const multerConfig: multer.Options = {
    storage,
};

export default multerConfig;
