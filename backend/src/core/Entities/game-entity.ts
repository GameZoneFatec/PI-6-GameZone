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
