import { Prisma, PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../../adapters/Repositories/Iuser-repository';
import { UserCreateDTO, UserResponseDTO, UserResponsePassDTO, UserUpdateDTO } from '../../../../core/Entities/user-entity';
import { ErrorApp } from '../../../../core/Error/erro-app';

export class UserRepoPrisma implements IUserRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: UserCreateDTO): Promise<UserResponseDTO> {
        try {
            const user = await this.prisma.user.create({
                data: data,
                omit: {
                    created_at: true,
                },
            });

            return user;
        } catch (err) {
            throw new ErrorApp('Erro no createUser', 500, err);
        }
    }

    async update(user: UserUpdateDTO, id: string): Promise<any> {
        const data: Prisma.UserUpdateInput = {
            name: user.name,
            password: user.password,
            email: user.email,
            username: user.username,
            bio: user.bio,
            premium: user.premium,
            favorite_GameId: user.favorite_GameId,
            favorite_name: user.favorite_name,
            favorite_url: user.favorite_url,
            email_verified: user.email_verified,
            email_verified_at: user.email_verified_a,
            profile_image_url: user.profile_image_url,
            plan_expires_at: user.plan_expires_at,
        };

        const selectUp = {
            id: true,
            name: !!data.name,
            email: !!data.email,
            username: !!data.username,
            profile_image_url: !!data.profile_image_url,
            email_verified: !!data.email_verified,
            email_verified_at: !!data.email_verified_at,
            favorite_GameId: !!data.favorite_GameId,
            favorite_name: !!data.favorite_name,
            favorite_url: !!data.favorite_url,
            bio: !!data.bio,
            premium: !!data.premium,
        };

        try {
            return await this.prisma.user.update({
                where: { id },
                data: data,
                select: selectUp,
            });
        } catch (err) {
            throw new ErrorApp('Erro no update', 500, err);
        }
    }

    async deleteUser(userId: string): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: { id: userId },
            });
        } catch (err: any) {
            throw new ErrorApp('Erro ao deletar usuário', 500, err);
        }
    }

    async findByEmail(email: string): Promise<UserResponseDTO | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { email },
                omit: {
                    created_at: true,
                    password: true,
                },
            });
        } catch (err) {
            throw new ErrorApp('Erro no findByEmail', 500, err);
        }
    }

    async findById(id: string): Promise<UserResponseDTO | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { id },
                omit: {
                    created_at: true,
                    password: true,
                },
            });
        } catch (err) {
            throw new ErrorApp('Erro no findById', 500, err);
        }
    }

    async findByUsername(username: string): Promise<UserResponseDTO | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { username },
                omit: {
                    created_at: true,
                    password: true,
                },
            });
        } catch (err) {
            throw new ErrorApp('Erro no FindByUsername', 500, err);
        }
    }

    async findByEmailWithPassword(email: string): Promise<UserResponsePassDTO | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { email },
                omit: {
                    created_at: true,
                },
            });
        } catch (err) {
            throw new ErrorApp('Erro no findByEmail', 500, err);
        }
    }
}
