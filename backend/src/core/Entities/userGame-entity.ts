import { GameStatus } from '@prisma/client';
import { GameCompact } from './game-entity';

export interface userGameEntity {
    id: string;
    userId: string;
    gameId: string;
    status?: GameStatus;
    note?: string;
}

export type ProfileCreateDTO = {
    userId: string;
    gameId: string;
    status: GameStatus;
    gameName?: string | null;
    note: string | null;
};

export type ProfileUpdateDTO = {
    profileId: string;
    status?: GameStatus;
    note?: string | null;
};

export type userWithGame = {
    user: userGameEntity;
    game: GameCompact;
};
