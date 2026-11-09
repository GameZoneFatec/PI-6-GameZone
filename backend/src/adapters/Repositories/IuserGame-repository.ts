import { GameStatus, UserGame } from '@prisma/client';
import { ProfileCreateDTO, ProfileUpdateDTO } from '../../core/Entities/userGame-entity';

export interface IUserGameRepository {
    getUserProfile(userId: string, page: number, limit: number, status?: GameStatus, search?: string): Promise<any>;
    createUserProfile(data: ProfileCreateDTO): Promise<any>;
    UpdateDataProfile(data: ProfileUpdateDTO): Promise<any>;
    DeleteUserGame(userGameId: string): Promise<void>;
    UserGameById(userGameId: string): Promise<{ id: string } | null>;
    UserGameByUserId(gameId: number, userId: string): Promise<UserGame | null>;
    VerifyGameWithUser(userId: string, rawgId: string): Promise<any>;
    totalGameStatusGame(gameId: number): Promise<any>;
    totalGameStatusUser(userId: string): Promise<any>;
}
