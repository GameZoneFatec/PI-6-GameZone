import { IUserGameRepository } from '../../../adapters/Repositories/IuserGame-repository';
import { ProfileUpdateDTO } from '../../Entities/userGame-entity';
import { ErrorBadRequest } from '../../Error/error-bad-request';

export class UserGameUpdateUsecase {
    constructor(private repository: IUserGameRepository) {}

    async execute(data: ProfileUpdateDTO) {
        
        return await this.repository.UpdateDataProfile(data);
    }

    validate(data: ProfileUpdateDTO) {
        if (data.status) {
            if (!['BACKLOG', 'PLAYING', 'FINISHED', 'DROPPED'].includes(data.status)) {
                throw new ErrorBadRequest('Parâmetro de status não é valido');
            }
        }
    }
}
