import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import { gameAdminService } from '@services/gameAdmin.service';
import type { IAdminGame, IAdminGamePage } from '@interfaces/game-admin.interface';
import { ActionButton, AdminMain, Badge, EmptyState, Hint, PageHeader } from './styles.adminModeration';
import { Chips, GameGrid, GameTile, NoCover, Pager, PrimaryButton, TileBody, TileFooter, Toolbar } from './styles.adminGames';
import { AdminSectionNav } from './AdminSectionNav';
import { GameFormModal } from './GameFormModal';

const PAGE_SIZE = 12;

/** Backoffice: manutenção do catálogo próprio de jogos (a API de jogos do SafePlay). */
const AdminGamesPage = () => {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<IAdminGamePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<IAdminGame | null | undefined>(undefined); // undefined = fechado, null = novo
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await gameAdminService.list(query, page, PAGE_SIZE));
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Busca enquanto digita (espera o usuário parar por 300 ms)
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      setQuery(search.trim());
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  async function remove(game: IAdminGame) {
    if (!window.confirm(`Remover "${game.name}" do catálogo? Esta ação não pode ser desfeita.`)) return;
    setBusy(game.id);
    try {
      await gameAdminService.remove(game.id);
      toast.success(`"${game.name}" removido do catálogo`);
      await load();
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setBusy(null);
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <AdminMain>
      <AdminSectionNav />
      <PageHeader>
        <div>
          <h1>Catálogo de jogos</h1>
          <p>A API de jogos do SafePlay: o que for cadastrado aqui aparece no site e no app.</p>
        </div>
        <PrimaryButton onClick={() => setEditing(null)}>+ Novo jogo</PrimaryButton>
      </PageHeader>

      <Toolbar>
        <input type='search' placeholder='Buscar jogo pelo nome' value={search} onChange={(e) => setSearch(e.target.value)} aria-label='Buscar jogo' />
        <span>{data ? `${data.total} jogo(s)` : ''}</span>
      </Toolbar>

      {loading && !data ? (
        <EmptyState>Carregando…</EmptyState>
      ) : !data?.items.length ? (
        <EmptyState>{query ? `Nenhum jogo encontrado para "${query}".` : 'Nenhum jogo no catálogo.'}</EmptyState>
      ) : (
        <GameGrid>
          {data.items.map((g) => {
            const inUse = g.reviews_count + g.library_count > 0;
            return (
              <GameTile key={g.id}>
                {g.cover_url ? <img src={g.cover_url} alt={`Capa de ${g.name}`} loading='lazy' /> : <NoCover>Sem capa</NoCover>}
                <TileBody>
                  <h3>{g.name}</h3>
                  <small>
                    {g.released ? new Date(g.released).getUTCFullYear() : 'Sem data'}
                    {g.metacritic != null && ` · Metacritic ${g.metacritic}`}
                    {g.steam_appid ? ' · importado' : ' · cadastrado aqui'}
                  </small>
                  <Chips>
                    {g.genres.slice(0, 3).map((genre) => (
                      <Badge key={genre}>{genre}</Badge>
                    ))}
                  </Chips>
                  <TileFooter>
                    <span>
                      {g.reviews_count} análise(s) · {g.library_count} na biblioteca
                    </span>
                  </TileFooter>
                  <TileFooter>
                    <ActionButton kind='ghost' onClick={() => setEditing(g)}>
                      Editar
                    </ActionButton>
                    <ActionButton
                      kind='remove'
                      disabled={inUse || busy === g.id}
                      title={inUse ? 'Jogo em uso: tem análises ou está na biblioteca de alguém' : undefined}
                      onClick={() => remove(g)}
                    >
                      Remover
                    </ActionButton>
                  </TileFooter>
                </TileBody>
              </GameTile>
            );
          })}
        </GameGrid>
      )}

      {data && data.total > PAGE_SIZE && (
        <Pager>
          <ActionButton kind='ghost' disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </ActionButton>
          <span>
            Página {page} de {totalPages}
          </span>
          <ActionButton kind='ghost' disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Próxima
          </ActionButton>
        </Pager>
      )}

      <Hint>
        Os 36 jogos iniciais foram importados uma única vez da loja da Steam; depois disso o catálogo é nosso e mantido só por aqui. Jogos com análises
        ou na biblioteca de algum jogador não podem ser removidos.
      </Hint>

      {editing !== undefined && (
        <GameFormModal
          game={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            load();
          }}
        />
      )}
    </AdminMain>
  );
};

export default AdminGamesPage;
