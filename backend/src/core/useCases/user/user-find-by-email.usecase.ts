import { IUserRepository } from '../../../adapters/Repositories/Iuser-repository';
import { UserResponseDTO } from '../../Entities/user-entity';
import { ErrorApp } from '../../Error/erro-app';

export class UserFindByEmailUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(email: string): Promise<UserResponseDTO> {
        const user = await this.userRepo.findByEmail(email);

        if (!user) {
            throw new ErrorApp('Usuário não cadastrado', 404);
        }

        return user;
    }
}
