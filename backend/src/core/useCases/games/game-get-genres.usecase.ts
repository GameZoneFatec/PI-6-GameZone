import { IGameRepository } from '../../../adapters/Repositories/Igame-repository';

export class GameGetGenresUseCase {
    constructor(private repository: IGameRepository) {}
    async execute() {
        return this.repository.getListGen();
    }
}
