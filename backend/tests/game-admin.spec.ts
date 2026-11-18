import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    GameAdminCreateUsecase,
    GameAdminDeleteUsecase,
    GameAdminUpdateUsecase,
} from '../src/core/useCases/games/game-admin.usecases';
import { IGameRepository } from '../src/adapters/Repositories/Igame-repository';
import { IMediaStorage } from '../src/adapters/IMediaStorage';
import { GameData, GameRecord, slugify } from '../src/core/Entities/game-entity';

const PNG_1PX =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/** Repositório de jogos em memória (só o que o backoffice usa). */
class InMemoryGames {
    games: GameRecord[] = [];
    usageById: Record<number, { reviews: number; library: number }> = {};

    asRepo(): IGameRepository {
        return {
            gameList: vi.fn(),
            getById: vi.fn(),
            getByIdSimple: vi.fn(),
            getListGen: vi.fn(),
            adminList: vi.fn(),
            findRecord: async (id) => this.games.find((g) => g.id === id) ?? null,
            slugInUse: async (slug, exceptId) => this.games.some((g) => g.slug === slug && g.id !== exceptId),
            create: async (data: GameData) => {
                const g: GameRecord = { ...data, id: this.games.length + 1, cover_image: data.cover_image ?? null, screenshots: [], steam_appid: null, created_at: new Date(), updated_at: new Date() };
                this.games.push(g);
                return g;
            },
            update: async (id, data) => {
                const g = this.games.find((x) => x.id === id)!;
                Object.assign(g, data);
                return g;
            },
            usage: async (id) => this.usageById[id] ?? { reviews: 0, library: 0 },
            delete: async (id) => {
                this.games = this.games.filter((g) => g.id !== id);
            },
        };
    }
}

class FakeMedia implements IMediaStorage {
    saved: string[] = [];
    removed: string[] = [];
    async save(dir: string, base: string, _data: Buffer, ext: string) {
        const p = `${dir}/${base}.${ext}`;
        this.saved.push(p);
        return p;
    }
    async remove(p: string) {
        this.removed.push(p);
    }
}

describe('Catálogo próprio de jogos (backoffice)', () => {
    let store: InMemoryGames;
    let media: FakeMedia;
    let create: GameAdminCreateUsecase;
    let update: GameAdminUpdateUsecase;
    let remove: GameAdminDeleteUsecase;

    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);
        store = new InMemoryGames();
        media = new FakeMedia();
        const repo = store.asRepo();
        create = new GameAdminCreateUsecase(repo, media);
        update = new GameAdminUpdateUsecase(repo, media);
        remove = new GameAdminDeleteUsecase(repo, media);
    });

    it('gera slug sem acentos e símbolos', () => {
        expect(slugify("Marvel’s Spider-Man: Ação & Aventura™")).toBe('marvel-s-spider-man-acao-aventura');
    });

    it('cria o jogo com slug, listas limpas e capa salva no armazenamento', async () => {
        const g = await create.execute({ name: '  Jogo Fatec  ', genres: ['Indie', ' Indie ', 'Ação'], platforms: 'PC, Android', released: '2026-11-30', metacritic: 88, cover_image_base64: PNG_1PX });
        expect(g.slug).toBe('jogo-fatec');
        expect(g.genres).toEqual(['Indie', 'Ação']);
        expect(g.platforms).toEqual(['PC', 'Android']);
        expect(g.released?.toISOString().slice(0, 10)).toBe('2026-11-30');
        expect(g.cover_image).toMatch(/^games\/jogo-fatec\/cover-\d+\.png$/);
        expect(media.saved).toHaveLength(1);
    });

    it('nome repetido ganha slug numerado', async () => {
        await create.execute({ name: 'Jogo Fatec' });
        const g2 = await create.execute({ name: 'Jogo Fatec' });
        expect(g2.slug).toBe('jogo-fatec-2');
    });

    it('recusa dados inválidos com a lista de campos (400)', async () => {
        await expect(create.execute({ name: '', metacritic: 120, released: '30/11/2026', website: 'site', cover_image_base64: 'data:text/plain;base64,AAAA' })).rejects.toMatchObject({
            statusCode: 400,
            details: expect.arrayContaining([
                expect.objectContaining({ field: 'name' }),
                expect.objectContaining({ field: 'metacritic' }),
                expect.objectContaining({ field: 'released' }),
                expect.objectContaining({ field: 'website' }),
                expect.objectContaining({ field: 'cover_image_base64' }),
            ]),
        });
    });

    it('edição troca a capa e apaga a antiga', async () => {
        const g = await create.execute({ name: 'Jogo', cover_image_base64: PNG_1PX });
        const old = g.cover_image!;
        await new Promise((r) => setTimeout(r, 2));
        const up = await update.execute(String(g.id), { metacritic: 70, cover_image_base64: PNG_1PX });
        expect(up.metacritic).toBe(70);
        expect(up.cover_image).not.toBe(old);
        expect(media.removed).toEqual([old]);
    });

    it('edição de jogo inexistente → 404; sem campos → 400', async () => {
        await expect(update.execute('99', { name: 'x' })).rejects.toMatchObject({ statusCode: 404 });
        const g = await create.execute({ name: 'Jogo' });
        await expect(update.execute(String(g.id), {})).rejects.toMatchObject({ statusCode: 400 });
    });

    it('não remove jogo com análises ou na biblioteca de alguém (409)', async () => {
        const g = await create.execute({ name: 'Popular' });
        store.usageById[g.id] = { reviews: 2, library: 1 };
        await expect(remove.execute(String(g.id))).rejects.toMatchObject({ statusCode: 409 });
        expect(store.games).toHaveLength(1);
    });

    it('remove jogo sem uso e apaga a capa', async () => {
        const g = await create.execute({ name: 'Sem uso', cover_image_base64: PNG_1PX });
        await expect(remove.execute(String(g.id))).resolves.toEqual({ id: g.id, deleted: true });
        expect(store.games).toHaveLength(0);
        expect(media.removed).toEqual([g.cover_image]);
    });
});
