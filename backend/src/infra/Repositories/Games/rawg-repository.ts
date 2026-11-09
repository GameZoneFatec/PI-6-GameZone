import { IGameRepository } from '../../../adapters/Repositories/Igame-repository';
import 'dotenv/config';
import {
    GameCompact,
    gameComplete,
    GameDevelopers,
    GameGenres,
    GamePlatforms,
    GamePublisher,
    GameScreenShots,
    GamesTrailers,
} from '../../../core/Entities/game-entity';
import { ErrorRawg } from '../../../util/error-rawg';

export class RawgRepostiry implements IGameRepository {
    private API_KEY = process.env.KAY_RAWG ?? '';

    async gameList(page: string = '1', pageSize: string = '10', search?: string, genres?: string): Promise<GameCompact[]> {
        let url = `https://api.rawg.io/api/games?key=${this.API_KEY}&page=${page}&page_size=${pageSize}`;
        if (search) url += `&search=${search}`;
        if (genres) url += `&genres=${genres}`;

        const response = await fetch(url);
        if (!response.ok) ErrorRawg(response.status);
        const data = await response.json();

        const games: GameCompact[] = data.results.map(
            (game: any): GameCompact => ({
                idGame: game.id,
                name: game.name,
                slug: game.slug,
                description: game.description,
                metacritic: game.metacritic,
                released: game.released,
                background_image: game.background_image,
                website: game.website,
                platforms: (game.platforms ?? []).map(
                    (p: any): GamePlatforms => ({
                        id: p.platform.id,
                        name: p.platform.name,
                        image_background: p.platform.image_background ?? null,
                        released_at: game.released_at,
                        requirements: {
                            minimum: game.requirements?.minimum ?? null,
                            recommended: game.requirements?.recommended ?? null,
                        },
                    }),
                ),
                genres: (game.genres ?? []).map(
                    (g: any): GameGenres => ({
                        id: g.id,
                        name: g.name,
                        slug: g.slug,
                        image_background: g.image_background,
                    }),
                ),
            }),
        );

        return games;
    }

    async getById(gameId: string): Promise<gameComplete> {
        const urlDetails = `https://api.rawg.io/api/games/${gameId}?key=${this.API_KEY}`;
        const urlScreen = `https://api.rawg.io/api/games/${gameId}/screenshots?key=${this.API_KEY}`;
        const urlTrailers = `https://api.rawg.io/api/games/${gameId}/movies?key=${this.API_KEY}`;

        const [detailRes, shotsRes, traiRes] = await Promise.all([fetch(urlDetails), fetch(urlScreen), fetch(urlTrailers)]);

        if (!detailRes.ok) ErrorRawg(detailRes.status);
        if (!shotsRes.ok) ErrorRawg(detailRes.status);
        if (!traiRes.ok) ErrorRawg(detailRes.status);

        const [data, screens, trailers] = await Promise.all([detailRes.json(), shotsRes.json(), traiRes.json()]);

        const {
            id,
            slug,
            name,
            name_original,
            description,
            metacritic,
            released,
            background_image,
            background_image_additional,
            playtime,
            reddit_url,
            website,
            metacritic_url,
            platforms,
            developers,
            genres,
            publishers,
            description_raw,
        } = data;

        const games: gameComplete = {
            idGame: id,
            slug,
            name,
            name_original,
            description,
            metacritic,
            description2: description_raw,
            released,
            background_image,
            background_image_additional,
            playtime,
            reddit_url,
            website,
            metacritic_url,
            palatforms: platforms.map(
                (g: any): GamePlatforms => ({
                    id: g.platform.id,
                    name: g.platform.name,
                    image_background: g.platform.image_background,
                    released_at: g.released_at,
                    requirements: {
                        minimum: g.requirements?.minimum,
                        recommended: g.requirements?.recommended,
                    },
                }),
            ),
            genres: (genres ?? []).map(
                (g: any): GameGenres => ({
                    id: g.id,
                    name: g.name,
                    slug: g.slug,
                    image_background: g.image_background,
                }),
            ),
            publishers: (publishers ?? []).map(
                (p: any): GamePublisher => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    image_background: p.image_background,
                }),
            ),
            developers: developers.map(
                (d: any): GameDevelopers => ({
                    id: d.id,
                    name: d.name,
                    slug: d.slug,
                    image_background: d.image_background,
                }),
            ),
            screen_shots: screens.results.map(
                (s: any): GameScreenShots => ({
                    id: s.id,
                    image: s.image,
                    height: s.height,
                    width: s.width,
                }),
            ),
            trailers: trailers.results.map(
                (s: any): GamesTrailers => ({
                    id: s.id,
                    name: s.name,
                    preview: s.preview,
                    data: {
                        '480': s.data[480],
                        max: s.data.max,
                    },
                }),
            ),
        };
        return games;
    }

    async getByIdSimple(rawgId: string): Promise<GameCompact> {
        const urlDetails = `https://api.rawg.io/api/games/${rawgId}?key=${this.API_KEY}`;

        const response = await fetch(urlDetails);
        if (!response.ok) ErrorRawg(response.status);
        const data = await response.json();

        const games: GameCompact = {
            idGame: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            metacritic: data.metacritic,
            released: data.released,
            background_image: data.background_image,
            website: data.website,
            platforms: data.platforms.map((g: any) => ({ id: g.platform.id, name: g.platform.name })),
            genres: data.genres.map((g: any) => ({ id: g.id, name: g.name })),
        };

        return games;
    }

    async getListGen(): Promise<GameGenres[]> {
        const url = `https://api.rawg.io/api/genres?key=${this.API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) ErrorRawg(response.status);

        const data = await response.json();

        const genres: GameGenres[] = data.results.map(
            (generos: any): GameGenres => ({
                id: generos.id,
                name: generos.name,
                slug: generos.slug,
                image_background: generos.image_background,
            }),
        );

        return genres;
    }
}
