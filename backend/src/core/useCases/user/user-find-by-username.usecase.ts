import { IUserRepository } from '../../../adapters/Repositories/Iuser-repository';
import { UserResponseDTO } from '../../Entities/user-entity';
import { ErrorApp } from '../../Error/erro-app';

export class UserFindByUsernameUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(username: string): Promise<UserResponseDTO> {
        const user = await this.userRepo.findByUsername(username);

        if (!user) {
            throw new ErrorApp('Usuário não cadastrado', 404);
        }

        return user;
    }
}
