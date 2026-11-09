import { ErrorApp } from '../core/Error/erro-app';
import { ErrorNotFound } from '../core/Error/error-not-found';

export function ErrorRawg(statusCode: number): void {
    if (statusCode == 404) throw new ErrorNotFound('Item não encontrado/cadastrado');
    if (statusCode == 401) throw new ErrorApp('Erro na autorização da rawg, verifique a chave da API', statusCode);
    if (statusCode == 429) throw new ErrorApp('Limite de requisições atingida, renove a chave rawg', statusCode);
    throw new ErrorApp('Erro ao fazer requisição com a rawg', statusCode);
}
