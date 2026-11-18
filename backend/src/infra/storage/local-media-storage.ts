import { mkdir, unlink, writeFile } from 'fs/promises';
import { join, normalize } from 'path';
import { IMediaStorage } from '../../adapters/IMediaStorage';
import { UPLOAD_MEDIA_DIR } from '../config/media-config';

/** Grava as imagens em backend/uploads/media, servidas pela API em /media. */
export class LocalMediaStorage implements IMediaStorage {
    async save(relativeDir: string, fileBaseName: string, data: Buffer, ext: 'jpg' | 'png' | 'webp'): Promise<string> {
        const rel = normalize(join(relativeDir, `${fileBaseName}.${ext}`)).split('\\').join('/');
        if (rel.startsWith('..')) throw new Error('caminho inválido');
        await mkdir(join(UPLOAD_MEDIA_DIR, relativeDir), { recursive: true });
        await writeFile(join(UPLOAD_MEDIA_DIR, rel), data);
        return rel;
    }

    async remove(relativePath: string): Promise<void> {
        const rel = normalize(relativePath);
        if (rel.startsWith('..')) return;
        await unlink(join(UPLOAD_MEDIA_DIR, rel)).catch(() => undefined); // imagens do catálogo (pasta media) nunca são apagadas
    }
}
