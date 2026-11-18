export interface gameComplete {
    idGame: number;
    slug: string;
    name: string;
    name_original: string | null;
    description: string | null;
    description2: string | null;
    metacritic: number | null;
    released: string | null;
    background_image: string | null;
    background_image_additional: string | null;
    playtime: number | null;
    reddit_url: string | null;
    website: string | null;
    metacritic_url: string | null;
    palatforms: GamePlatforms[];
    genres: GameGenres[];
    publishers: GamePublisher[];
    developers: GameDevelopers[];
    screen_shots: GameScreenShots[];
    trailers: GamesTrailers[];
}

export interface GameCompact {
    idGame: number;
    name: string;
    slug: string;
    description: string | null;
    metacritic: number | null;
    released: string | null;
    background_image: string | null;
    website: string | null;
    platforms: GamePlatforms[];
    genres: GameGenres[];
}

// ------------------------------------------------

export interface GamePlatforms {
    id: number;
    name: string;
    image_background: string | null;
    released_at: string | null;
    requirements?: {
        minimum?: string;
        recommended?: string;
    };
}

// ------------------------------------------------

export interface GameGenres {
    id: number;
    name: string;
    slug: string | null;
    image_background: string | null;
}

// ------------------------------------------------

export interface GamePublisher {
    id: number;
    name: string;
    slug: string;
    image_background: string | null;
}

// ------------------------------------------------

export interface GameDevelopers {
    id: number;
    name: string;
    slug: string;
    image_background: string;
}

// ------------------------------------------------

export interface GameScreenShots {
    id: number;
    image: string;
    width: number | null;
    height: number | null;
}

// ------------------------------------------------

export interface GamesTrailers {
    id: number;
    name: string;
    preview: string;
    data: {
        480: string;
        max: string;
    };
}

// ------------------------------------------------
// Catálogo próprio (tabela Game)

/** Jogo como está gravado no banco (imagens com caminho relativo à pasta de mídia). */
export interface GameRecord {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    released: Date | null;
    metacritic: number | null;
    developers: string[];
    publishers: string[];
    genres: string[];
    platforms: string[];
    cover_image: string | null;
    screenshots: string[];
    website: string | null;
    steam_appid: number | null;
    created_at: Date;
    updated_at: Date;
}

/** Dados que o administrador envia para criar/editar um jogo (já validados). */
export interface GameData {
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    released: Date | null;
    metacritic: number | null;
    developers: string[];
    publishers: string[];
    genres: string[];
    platforms: string[];
    website: string | null;
    cover_image?: string | null;
}

export interface GameAdminItem extends GameRecord {
    cover_url: string | null;
    reviews_count: number;
    library_count: number;
}

export function slugify(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}
