/** Jogo do catálogo próprio, como o backoffice recebe de GET /admin/games. */
export interface IAdminGame {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  released: string | null; // ISO
  metacritic: number | null;
  developers: string[];
  publishers: string[];
  genres: string[];
  platforms: string[];
  cover_image: string | null;
  cover_url: string | null;
  screenshots: string[];
  website: string | null;
  steam_appid: number | null;
  reviews_count: number;
  library_count: number;
  updated_at: string;
}

export interface IAdminGamePage {
  items: IAdminGame[];
  total: number;
  page: number;
  limit: number;
}

/** Corpo de POST/PUT /admin/games. */
export interface IGameInput {
  name?: string;
  short_description?: string | null;
  description?: string | null;
  released?: string | null; // AAAA-MM-DD
  metacritic?: number | null;
  genres?: string[];
  platforms?: string[];
  developers?: string[];
  publishers?: string[];
  website?: string | null;
  cover_image_base64?: string | null;
}

export interface IFieldError {
  field: string;
  message: string;
}
