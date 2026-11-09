import path from 'path';
import fs from 'fs';

export class LocalImageStorage {
    static async deleteByUrl(url: string): Promise<void> {
        const oldName = url?.split('/').pop();
        let pathImage: string = '';
        if (oldName) {
            pathImage = path.join(__dirname, '..', '..', '..', 'uploads', 'profile', path.basename(oldName));
        }

        if (fs.existsSync(pathImage)) {
            await fs.unlinkSync(pathImage);
        }
    }

    static async deleteByIDImage(idImage: string): Promise<void> {
        let pathImage: string = path.join(__dirname, '..', '..', '..', 'uploads', 'profile', path.basename(idImage));

        if (fs.existsSync(pathImage)) {
            await fs.unlinkSync(pathImage);
        }
    }
}
