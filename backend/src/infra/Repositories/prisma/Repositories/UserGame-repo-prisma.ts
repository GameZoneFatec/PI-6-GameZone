import { GameStatus, Prisma, UserGame } from '@prisma/client';
import { IGameRepository } from '../../../../adapters/Repositories/Igame-repository';
import { ProfileCreateDTO, ProfileUpdateDTO } from '../../../../core/Entities/userGame-entity';
import { ErrorApp } from '../../../../core/Error/erro-app';
import { prisma } from '../client';
import { IUserGameRepository } from '../../../../adapters/Repositories/IuserGame-repository';

export class UserGameRepoPrisma implements IUserGameRepository {
    constructor(private repository: IGameRepository) {}

    async createUserProfile(profile: ProfileCreateDTO): Promise<any> {
        const gameId = Number(profile.gameId);
        const data: Prisma.UserGameCreateInput = {
            gameId: gameId,
            status: profile.status,
            user: {
                connect: { id: profile.userId },
            },
            note: profile.note,
            game_name: profile.gameName,
        };
        //
        try {
            const profile = await prisma.userGame.create({
                data,
                select: { id: true },
            });

            return profile;
        } catch (err) {
            throw new ErrorApp('Erro no repository ao cadastrar no perfil', 500, err);
        }
    }

    async getUserProfile(userId: string, page: number = 1, limit: number = 4, status?: GameStatus, search?: string): Promise<any> {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        try {
            const [data, total] = await Promise.all([
                prisma.userGame.findMany({
                    where: {
                        userId,
                        ...(status ? { status } : {}),
                        ...(search ? { game_name: { contains: search, mode: 'insensitive' } } : {}),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                    orderBy: { created_at: 'desc' },
                }),
                prisma.userGame.count({
                    where: { userId, ...(status ? { status } : {}) },
                }),
            ]);

            const totalPage = Math.ceil(total / limit);
            if (data.length === 0) {
                return [];
            }

            const userWithGame = await Promise.all(
                data.map(async (user: any) => {
                    const game = await this.repository.getByIdSimple(user.gameId).catch((err: any) => {
                        console.log(err);
                    });
                    return {
                        ...user,
                        game: game,
                    };
                }),
            );

            return {
                data: userWithGame,
                totalGames: total,
                totalPage,
                currentPage: page,
            };
        } catch (err) {
            console.error('Erro: ', err);
            throw new ErrorApp('Erro ao buscar o games do perfil no repositório', 500);
        }
    }

    async UpdateDataProfile(profileUpdate: ProfileUpdateDTO): Promise<any> {
        try {
            const data: Prisma.UserGameUpdateInput = {
                status: profileUpdate.status,
                note: profileUpdate.note,
            };
            //
            const select = {
                status: !!data.status,
                note: !!data.note,
            };
            //
            const perfilUpdate = await prisma.userGame.update({
                where: { id: profileUpdate.profileId },
                data,
                select,
            });

            return perfilUpdate;
        } catch (err) {
            throw new ErrorApp('Erro ao atualizar o perfil no repositório', 500, err);
        }
    }

    async DeleteUserGame(userGameId: string): Promise<void> {
        try {
            await prisma.userGame.delete({
                where: { id: userGameId },
            });
        } catch (err: any) {
            throw new ErrorApp('Erro ao deletar game do perfil', 500, err);
        }
    }

    async UserGameById(userGameId: string): Promise<{ id: string } | null> {
        try {
            const userGame = await prisma.userGame.findFirst({
                where: { id: userGameId },
                select: {
                    id: true,
                },
            });

            return userGame;
        } catch (err: any) {
            throw new ErrorApp('Erro ao deletar game do perfil', 500, err);
        }
    }

    async UserGameByUserId(gameId: number, userId: string): Promise<UserGame | null> {
        try {
            const userGame = await prisma.userGame.findUnique({
                where: {
                    userId_gameId: {
                        gameId,
                        userId,
                    },
                },
            });

            return userGame;
        } catch (err: any) {
            throw new ErrorApp('Erro ao buscar o perfil', 500, err);
        }
    }

    async VerifyGameWithUser(userId: string, rawgId: string): Promise<Boolean> {
        const idGame = Number(rawgId);
        try {
            let exist = false;
            const profile = await prisma.userGame.findFirst({
                where: { userId: userId, gameId: idGame },
            });
            //
            if (profile) exist = true;
            //
            return exist;
        } catch (err) {
            throw new ErrorApp('Erro ao consultar o banco (verifyGameWithUser)', 500, err);
        }
    }

    async totalGameStatusGame(gameId: number): Promise<any> {
        try {
            const result = await prisma.userGame.groupBy({
                by: ['status'],
                where: { gameId: Number(gameId) },
                _count: { _all: true },
            });

            return result.map((r) => ({ status: r.status, total: r._count._all }));
        } catch (err: any) {
            throw new ErrorApp('Erro ao pegar total game status', 500, err);
        }
    }

    async totalGameStatusUser(userId: string): Promise<any> {
        try {
            const result = await prisma.userGame.groupBy({
                by: ['status'],
                where: { userId: userId },
                _count: { _all: true },
            });

            const out = result.map((r) => ({
                status: r.status,
                total: r._count._all,
            }));

            return out;
        } catch (err: any) {
            throw new ErrorApp('Erro ao pegar tota game status', 500, err);
        }
    }
}
