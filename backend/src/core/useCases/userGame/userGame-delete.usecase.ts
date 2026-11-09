import { IUserGameRepository } from '../../../adapters/Repositories/IuserGame-repository';

export class userGameDelete {
    constructor(private repo: IUserGameRepository) {}

    async execute(userGameId: string) {
        await this.repo.DeleteUserGame(userGameId);
    }
}
