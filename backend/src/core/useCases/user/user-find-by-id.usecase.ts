import { VerifyUserService } from '../../../application/Services/user/verify-user.service';
import { UserResponseDTO } from '../../Entities/user-entity';

export class UserFindByIdUseCase {
    constructor(private verifyUser: VerifyUserService) {}

    async execute(userId: string): Promise<UserResponseDTO | null> {
        const user = await this.verifyUser.VerifyId(userId);

        return user;
    }
}
