import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

/** Snapshot do catálogo importado (versionado no Git junto com as imagens em backend/media). */
export const CATALOG_FILE = resolve(__dirname, '..', '..', '..', 'prisma', 'data', 'games.json');

export interface CatalogGame {
    steam_appid: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    released: string | null; // AAAA-MM-DD
    metacritic: number | null;
    developers: string[];
    publishers: string[];
    genres: string[];
    platforms: string[];
    website: string | null;
    cover_image: string;
    screenshots: string[];
}

/** Carrega o games.json no banco (idempotente: cria ou atualiza pelo steam_appid). */
export async function loadCatalog(prisma: PrismaClient) {
    const games: CatalogGame[] = JSON.parse(await readFile(CATALOG_FILE, 'utf-8'));
    let created = 0;
    let updated = 0;
    for (const g of games) {
        const data = { ...g, released: g.released ? new Date(`${g.released}T00:00:00Z`) : null };
        const exists = await prisma.game.findUnique({ where: { steam_appid: g.steam_appid }, select: { id: true } });
        if (exists) {
            await prisma.game.update({ where: { id: exists.id }, data });
            updated++;
        } else {
            await prisma.game.create({ data });
            created++;
        }
    }
    return { created, updated, total: games.length };
}
