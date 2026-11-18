import { resolve } from 'path';

/** Imagens do catálogo importado (versionadas no Git). */
export const CATALOG_MEDIA_DIR = resolve(__dirname, '..', '..', '..', 'media');
/** Imagens enviadas pelo backoffice (fora do Git, como as fotos de perfil). */
export const UPLOAD_MEDIA_DIR = resolve(__dirname, '..', '..', '..', 'uploads', 'media');

/**
 * URL pública de uma imagem. MEDIA_BASE_URL permite trocar o host (ex.: o IP do PC
 * na rede, para o app Flutter no celular); por padrão usa BASE_URL.
 */
export function mediaUrl(relativePath: string | null | undefined): string | null {
    if (!relativePath) return null;
    if (/^https?:\/\//.test(relativePath)) return relativePath;
    const base = (process.env.MEDIA_BASE_URL || process.env.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
    return `${base}/media/${relativePath}`;
}
