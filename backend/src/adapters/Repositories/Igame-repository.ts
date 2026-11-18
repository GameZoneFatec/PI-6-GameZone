import { GameAdminItem, GameCompact, gameComplete, GameData, GameGenres, GameRecord } from '../../core/Entities/game-entity';

export interface IGameRepository {
    // Leitura (site, app e casos de uso de biblioteca) — mesmo formato da antiga integração com a RAWG
    gameList(page: string, pageSize: string, search?: string, genres?: string): Promise<GameCompact[]>;
    getById(gameId: string): Promise<gameComplete>;
    getByIdSimple(gameId: string): Promise<GameCompact>;
    getListGen(): Promise<GameGenres[]>;

    // Manutenção do catálogo (backoffice)
    findRecord(id: number): Promise<GameRecord | null>;
    slugInUse(slug: string, exceptId?: number): Promise<boolean>;
    adminList(search: string | undefined, page: number, limit: number): Promise<{ items: GameAdminItem[]; total: number; page: number; limit: number }>;
    create(data: GameData): Promise<GameRecord>;
    update(id: number, data: Partial<GameData>): Promise<GameRecord>;
    usage(id: number): Promise<{ reviews: number; library: number }>;
    delete(id: number): Promise<void>;
}
