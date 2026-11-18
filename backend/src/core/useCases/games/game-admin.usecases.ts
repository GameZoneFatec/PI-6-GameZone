import { IMediaStorage } from '../../../adapters/IMediaStorage';
import { IGameRepository } from '../../../adapters/Repositories/Igame-repository';
import { GameData, slugify } from '../../Entities/game-entity';
import { ErrorBadRequest } from '../../Error/error-bad-request';
import { ErrorConflitct } from '../../Error/error-conflict';
import { ErrorNotFound } from '../../Error/error-not-found';

const MAX_COVER_BYTES = 2 * 1024 * 1024;
const COVER_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as const;

type Field = { field: string; message: string };

function parseId(id: unknown): number {
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) throw new ErrorBadRequest('id do jogo inválido');
    return n;
}

function str(body: any, key: string, max: number, errors: Field[], required = false): string | null | undefined {
    const v = body[key];
    if (v === undefined) return required ? (errors.push({ field: key, message: 'obrigatório' }), undefined) : undefined;
    if (v === null || v === '') return required ? (errors.push({ field: key, message: 'obrigatório' }), undefined) : null;
    if (typeof v !== 'string') return errors.push({ field: key, message: 'deve ser texto' }), undefined;
    const t = v.trim();
    if (required && !t) return errors.push({ field: key, message: 'obrigatório' }), undefined;
    if (t.length > max) return errors.push({ field: key, message: `máximo de ${max} caracteres` }), undefined;
    return t || null;
}

function list(body: any, key: string, errors: Field[]): string[] | undefined {
    const v = body[key];
    if (v === undefined) return undefined;
    const arr = typeof v === 'string' ? v.split(',') : v;
    if (!Array.isArray(arr) || arr.some((x) => typeof x !== 'string')) return errors.push({ field: key, message: 'deve ser lista de textos' }), undefined;
    const clean = [...new Set(arr.map((x: string) => x.trim()).filter(Boolean))];
    if (clean.length > 15 || clean.some((x) => x.length > 60)) return errors.push({ field: key, message: 'até 15 itens de 60 caracteres' }), undefined;
    return clean;
}

/** Valida o corpo enviado pelo backoffice. `partial` = edição (só os campos enviados). */
export function parseGameBody(body: any, partial: boolean): { data: Partial<GameData>; cover?: { data: Buffer; ext: 'jpg' | 'png' | 'webp' } | null } {
    if (!body || typeof body !== 'object') throw new ErrorBadRequest('Corpo da requisição inválido');
    const errors: Field[] = [];
    const data: Partial<GameData> = {};

    const name = str(body, 'name', 120, errors, !partial);
    if (name) data.name = name;
    const short = str(body, 'short_description', 400, errors);
    if (short !== undefined) data.short_description = short;
    const desc = str(body, 'description', 8000, errors);
    if (desc !== undefined) data.description = desc;
    const website = str(body, 'website', 300, errors);
    if (website !== undefined) {
        if (website && !/^https?:\/\/\S+$/.test(website)) errors.push({ field: 'website', message: 'URL inválida' });
        data.website = website;
    }

    if (body.released !== undefined) {
        if (body.released === null || body.released === '') data.released = null;
        else if (typeof body.released !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.released) || isNaN(Date.parse(body.released)))
            errors.push({ field: 'released', message: 'data no formato AAAA-MM-DD' });
        else data.released = new Date(`${body.released}T00:00:00Z`);
    }
    if (body.metacritic !== undefined) {
        const m = body.metacritic === null || body.metacritic === '' ? null : Number(body.metacritic);
        if (m !== null && (!Number.isInteger(m) || m < 0 || m > 100)) errors.push({ field: 'metacritic', message: 'inteiro de 0 a 100' });
        else data.metacritic = m;
    }
    for (const key of ['genres', 'platforms', 'developers', 'publishers'] as const) {
        const l = list(body, key, errors);
        if (l !== undefined) data[key] = l;
    }

    let cover: { data: Buffer; ext: 'jpg' | 'png' | 'webp' } | null | undefined;
    if (body.cover_image_base64 !== undefined) {
        if (body.cover_image_base64 === null || body.cover_image_base64 === '') cover = null;
        else {
            const m = typeof body.cover_image_base64 === 'string' && /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(body.cover_image_base64);
            if (!m) errors.push({ field: 'cover_image_base64', message: 'imagem JPG, PNG ou WEBP em data URL (base64)' });
            else {
                const buf = Buffer.from(m[2]!, 'base64');
                if (buf.length > MAX_COVER_BYTES) errors.push({ field: 'cover_image_base64', message: 'imagem de até 2 MB' });
                else cover = { data: buf, ext: COVER_TYPES[m[1] as keyof typeof COVER_TYPES] };
            }
        }
    }

    if (errors.length) throw new ErrorBadRequest('Dados do jogo inválidos', errors);
    return { data, cover };
}

export class GameAdminListUsecase {
    constructor(private repo: IGameRepository) {}
    async execute(search: unknown, page: unknown, limit: unknown) {
        const p = page === undefined ? 1 : Number(page);
        const l = limit === undefined ? 20 : Number(limit);
        if (!Number.isInteger(p) || p < 1) throw new ErrorBadRequest('page deve ser um inteiro >= 1');
        if (!Number.isInteger(l) || l < 1 || l > 100) throw new ErrorBadRequest('limit deve ser um inteiro entre 1 e 100');
        return this.repo.adminList(typeof search === 'string' ? search : undefined, p, l);
    }
}

export class GameAdminCreateUsecase {
    constructor(private repo: IGameRepository, private media: IMediaStorage) {}

    async execute(body: unknown) {
        const { data, cover } = parseGameBody(body, false);
        let slug = slugify(data.name!);
        if (!slug) throw new ErrorBadRequest('Dados do jogo inválidos', [{ field: 'name', message: 'precisa ter letras ou números' }]);
        for (let i = 2; await this.repo.slugInUse(slug); i++) slug = `${slugify(data.name!)}-${i}`;

        const coverPath = cover ? await this.media.save(`games/${slug}`, `cover-${Date.now()}`, cover.data, cover.ext) : null;
        const game = await this.repo.create({
            name: data.name!,
            slug,
            short_description: data.short_description ?? null,
            description: data.description ?? null,
            released: data.released ?? null,
            metacritic: data.metacritic ?? null,
            developers: data.developers ?? [],
            publishers: data.publishers ?? [],
            genres: data.genres ?? [],
            platforms: data.platforms ?? [],
            website: data.website ?? null,
            cover_image: coverPath,
        });
        console.log(`[catalogo] jogo criado: #${game.id} ${game.name}`);
        return game;
    }
}

export class GameAdminUpdateUsecase {
    constructor(private repo: IGameRepository, private media: IMediaStorage) {}

    async execute(idParam: unknown, body: unknown) {
        const id = parseId(idParam);
        const current = await this.repo.findRecord(id);
        if (!current) throw new ErrorNotFound('Jogo não encontrado');
        const { data, cover } = parseGameBody(body, true);
        if (cover !== undefined) {
            data.cover_image = cover ? await this.media.save(`games/${current.slug}`, `cover-${Date.now()}`, cover.data, cover.ext) : null;
            if (current.cover_image) await this.media.remove(current.cover_image);
        }
        if (!Object.keys(data).length) throw new ErrorBadRequest('Nenhum campo para atualizar');
        const game = await this.repo.update(id, data);
        console.log(`[catalogo] jogo atualizado: #${id} ${game.name}`);
        return game;
    }
}

export class GameAdminDeleteUsecase {
    constructor(private repo: IGameRepository, private media: IMediaStorage) {}

    async execute(idParam: unknown) {
        const id = parseId(idParam);
        const current = await this.repo.findRecord(id);
        if (!current) throw new ErrorNotFound('Jogo não encontrado');
        const used = await this.repo.usage(id);
        if (used.reviews || used.library) {
            throw new ErrorConflitct(used, `Jogo em uso: ${used.reviews} análise(s) e ${used.library} jogador(es) com ele na biblioteca`);
        }
        await this.repo.delete(id);
        if (current.cover_image) await this.media.remove(current.cover_image);
        console.log(`[catalogo] jogo removido: #${id} ${current.name}`);
        return { id, deleted: true };
    }
}
