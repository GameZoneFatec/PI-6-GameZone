import { UserCreateDTO, UserResponseDTO, UserResponsePassDTO, UserUpdateDTO } from '../../core/Entities/user-entity';

export interface IUserRepository {
    create(data: UserCreateDTO): Promise<UserResponseDTO>;
    update(data: UserUpdateDTO, id: string): Promise<any>;
    deleteUser(userId: string): Promise<void>;
    findByEmail(email: string): Promise<UserResponseDTO | null>;
    findByUsername(username: string): Promise<UserResponseDTO | null>;
    findById(id: string): Promise<UserResponseDTO | null>;
    findByEmailWithPassword(email: string): Promise<UserResponsePassDTO | null>;
}
