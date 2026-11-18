import { api } from './api';
import type { IAdminGame, IAdminGamePage, IGameInput } from '@interfaces/game-admin.interface';

/** Catálogo próprio de jogos — rotas do backoffice (exigem ADMIN). */
export const gameAdminService = {
  async list(search: string, page: number, limit = 12) {
    const { data } = await api.get<IAdminGamePage>('/admin/games', { params: { search: search || undefined, page, limit } });
    return data;
  },

  async create(input: IGameInput) {
    const { data } = await api.post<IAdminGame>('/admin/games', input);
    return data;
  },

  async update(id: number, input: IGameInput) {
    const { data } = await api.put<IAdminGame>(`/admin/games/${id}`, input);
    return data;
  },

  async remove(id: number) {
    const { data } = await api.delete<{ id: number; deleted: boolean }>(`/admin/games/${id}`);
    return data;
  }
};
