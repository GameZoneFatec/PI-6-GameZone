import { IGameRepository } from '../../../adapters/Repositories/Igame-repository';

export class GameListUseCase {
    constructor(private gameRepo: IGameRepository) {}

    async execute(page: string, pageSize: string, search?: string, genre?: string) {
        const games = await this.gameRepo.gameList(page, pageSize, search, genre);
        return games;
    }
}
