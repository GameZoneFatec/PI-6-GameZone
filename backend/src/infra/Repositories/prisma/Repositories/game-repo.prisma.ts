import { Prisma, PrismaClient } from '@prisma/client';
import { IGameRepository } from '../../../../adapters/Repositories/Igame-repository';
import {
    GameAdminItem,
    GameCompact,
    gameComplete,
    GameData,
    GameGenres,
    GamePlatforms,
    GameRecord,
    slugify,
} from '../../../../core/Entities/game-entity';
import { ErrorBadRequest } from '../../../../core/Error/error-bad-request';
import { ErrorNotFound } from '../../../../core/Error/error-not-found';
import { mediaUrl } from '../../../config/media-config';

/**
 * Catálogo PRÓPRIO de jogos (PostgreSQL). Devolve os mesmos formatos que a antiga
 * integração com a RAWG devolvia, para o site e os casos de uso continuarem iguais.
 */
export class GameRepoPrisma implements IGameRepository {
    constructor(private prisma: PrismaClient) {}

    private parseId(gameId: string | number): number {
        const id = Number(gameId);
        if (!Number.isInteger(id) || id < 1) throw new ErrorBadRequest('gameId inválido');
        return id;
    }

    private date(d: Date | null): string | null {
        return d ? d.toISOString().slice(0, 10) : null;
    }

    private platforms(g: GameRecord): GamePlatforms[] {
        return g.platforms.map((name, i) => ({ id: i + 1, name, image_background: null, released_at: this.date(g.released) }));
    }

    private genres(names: string[]): GameGenres[] {
        return names.map((name, i) => ({ id: i + 1, name, slug: slugify(name), image_background: null }));
    }

    private toCompact(g: GameRecord): GameCompact {
        return {
            idGame: g.id,
            name: g.name,
            slug: g.slug,
            description: g.short_description,
            metacritic: g.metacritic,
            released: this.date(g.released),
            background_image: mediaUrl(g.cover_image),
            website: g.website,
            platforms: this.platforms(g),
            genres: this.genres(g.genres),
        };
    }

    private toComplete(g: GameRecord): gameComplete {
        const named = (names: string[]) => names.map((name, i) => ({ id: i + 1, name, slug: slugify(name), image_background: '' }));
        return {
            idGame: g.id,
            slug: g.slug,
            name: g.name,
            name_original: g.name,
            description: g.description ?? g.short_description,
            description2: g.short_description,
            metacritic: g.metacritic,
            released: this.date(g.released),
            background_image: mediaUrl(g.cover_image),
            background_image_additional: mediaUrl(g.screenshots[0]),
            playtime: null,
            reddit_url: null,
            website: g.website,
            metacritic_url: null,
            palatforms: this.platforms(g),
            genres: this.genres(g.genres),
            publishers: named(g.publishers),
            developers: named(g.developers),
            screen_shots: g.screenshots.map((s, i) => ({ id: i + 1, image: mediaUrl(s)!, width: 600, height: 338 })),
            trailers: [],
        };
    }

    async gameList(page = '1', pageSize = '10', search?: string, genres?: string): Promise<GameCompact[]> {
        const p = Math.max(1, Number(page) || 1);
        const size = Math.min(40, Math.max(1, Number(pageSize) || 10));
        const where: Prisma.GameWhereInput = {};
        if (search?.trim()) where.name = { contains: search.trim(), mode: 'insensitive' };
        if (genres?.trim()) {
            const wanted = genres.split(',').map((s) => slugify(s));
            const names = (await this.getListGen()).filter((g) => wanted.includes(g.slug ?? '')).map((g) => g.name);
            where.genres = { hasSome: names.length ? names : ['__nenhum__'] };
        }
        const rows = await this.prisma.game.findMany({
            where,
            orderBy: [{ metacritic: { sort: 'desc', nulls: 'last' } }, { name: 'asc' }],
            skip: (p - 1) * size,
            take: size,
        });
        return rows.map((g) => this.toCompact(g));
    }

    async getById(gameId: string): Promise<gameComplete> {
        const g = await this.prisma.game.findUnique({ where: { id: this.parseId(gameId) } });
        if (!g) throw new ErrorNotFound('Jogo não encontrado');
        return this.toComplete(g);
    }

    async getByIdSimple(gameId: string): Promise<GameCompact> {
        const g = await this.prisma.game.findUnique({ where: { id: this.parseId(gameId) } });
        if (!g) throw new ErrorNotFound('Jogo não encontrado');
        return this.toCompact(g);
    }

    async getListGen(): Promise<GameGenres[]> {
        const rows = await this.prisma.$queryRaw<{ name: string }[]>`SELECT DISTINCT unnest(genres) AS name FROM "Game" ORDER BY 1`;
        return this.genres(rows.map((r) => r.name));
    }

    // ---------------- backoffice ----------------

    findRecord(id: number): Promise<GameRecord | null> {
        return this.prisma.game.findUnique({ where: { id } });
    }

    async slugInUse(slug: string, exceptId?: number): Promise<boolean> {
        const g = await this.prisma.game.findUnique({ where: { slug }, select: { id: true } });
        return !!g && g.id !== exceptId;
    }

    async adminList(search: string | undefined, page: number, limit: number) {
        const where: Prisma.GameWhereInput = search?.trim() ? { name: { contains: search.trim(), mode: 'insensitive' } } : {};
        const [rows, total] = await Promise.all([
            this.prisma.game.findMany({
                where,
                orderBy: [{ updated_at: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
                include: { _count: { select: { reviews: true, userGames: true } } },
            }),
            this.prisma.game.count({ where }),
        ]);
        const items: GameAdminItem[] = rows.map(({ _count, ...g }) => ({
            ...g,
            cover_url: mediaUrl(g.cover_image),
            reviews_count: _count.reviews,
            library_count: _count.userGames,
        }));
        return { items, total, page, limit };
    }

    create(data: GameData): Promise<GameRecord> {
        return this.prisma.game.create({ data });
    }

    update(id: number, data: Partial<GameData>): Promise<GameRecord> {
        return this.prisma.game.update({ where: { id }, data });
    }

    async usage(id: number) {
        const [reviews, library] = await Promise.all([
            this.prisma.review.count({ where: { gameId: id } }),
            this.prisma.userGame.count({ where: { gameId: id } }),
        ]);
        return { reviews, library };
    }

    async delete(id: number): Promise<void> {
        await this.prisma.game.delete({ where: { id } });
    }
}
