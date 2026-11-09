import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import { moderationService } from '@services/moderation.service';
import {
  REASON_LABEL,
  REPORT_STATUS_LABEL,
  type IModerationQueueItem,
  type IModerationStats,
  type IReportRecord,
  type ModerationDecision,
  type ModerationReviewStatus,
  type ReportStatus
} from '@interfaces/moderation.interface';
import {
  ActionButton,
  Actions,
  AdminMain,
  Badge,
  EmptyState,
  HeaderActions,
  Hint,
  List,
  PageHeader,
  ReportsTable,
  ReviewBody,
  ReviewItem,
  ReviewTop,
  StatCard,
  StatsGrid,
  Tab,
  TableScroll,
  Tabs
} from './styles.adminModeration';

type TabKey = ModerationReviewStatus | 'PENDING_REPORTS';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'HIDDEN', label: 'Aguardando decisão' },
  { key: 'PUBLISHED', label: 'Publicadas com denúncias' },
  { key: 'REMOVED', label: 'Removidas' },
  { key: 'PENDING_REPORTS', label: 'Processamento pendente' }
];

const REFRESH_MS = 5000;

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

const statusTone = (s: ReportStatus) =>
  s === 'PENDING' ? 'warn' : s === 'PROCESSED' ? 'neutral' : s === 'ACCEPTED' ? 'danger' : 'ok';

const AdminModerationPage = () => {
  const [tab, setTab] = useState<TabKey>('HIDDEN');
  const [stats, setStats] = useState<IModerationStats | null>(null);
  const [queue, setQueue] = useState<IModerationQueueItem[]>([]);
  const [pending, setPending] = useState<IReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const [s, list] = await Promise.all([
          moderationService.stats(),
          tab === 'PENDING_REPORTS' ? moderationService.reports('PENDING') : moderationService.queue(tab)
        ]);
        setStats(s);
        if (tab === 'PENDING_REPORTS') setPending(list as IReportRecord[]);
        else setQueue(list as IModerationQueueItem[]);
        setUpdatedAt(new Date());
      } catch (error) {
        if (!silent) handleAxiosErrors(error);
      } finally {
        setLoading(false);
      }
    },
    [tab]
  );

  // Atualiza sozinho para o admin ver o efeito do worker sem recarregar a página
  useEffect(() => {
    load();
    const id = setInterval(() => load(true), REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  async function decide(item: IModerationQueueItem, decision: ModerationDecision) {
    const verb = decision === 'KEEP' ? 'manter' : 'remover';
    if (!window.confirm(`Confirma ${verb} a análise "${item.title}"?`)) return;
    setBusy(item.reviewId);
    try {
      const out = await moderationService.decide(item.reviewId, decision);
      toast.success(
        decision === 'KEEP'
          ? `Análise mantida e republicada (${out.resolvedReports} denúncias descartadas)`
          : `Análise removida (${out.resolvedReports} denúncias aceitas)`
      );
      await load(true);
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setBusy(null);
    }
  }

  async function republish() {
    setBusy('republish');
    try {
      const out = await moderationService.republishPending();
      if (out.found === 0) toast.info('Nenhuma denúncia pendente há mais de 30 segundos');
      else if (out.failed === 0) toast.success(`${out.published} denúncia(s) reenviada(s) para o worker`);
      else toast.warning(`${out.published} reenviada(s), ${out.failed} falharam — o broker continua indisponível?`);
      await load(true);
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminMain>
      <PageHeader>
        <div>
          <h1>Moderação</h1>
          <p>Análises denunciadas pela comunidade e processadas pelo worker de moderação (RabbitMQ).</p>
        </div>
        <HeaderActions>
          <span>Atualizado {updatedAt ? updatedAt.toLocaleTimeString('pt-BR') : '—'}</span>
          <ActionButton kind='ghost' onClick={() => load()}>
            Atualizar
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <StatsGrid>
        <StatCard tone={stats?.reviews.hidden ? 'warn' : 'neutral'}>
          <span>Aguardando decisão</span>
          <strong>{stats?.reviews.hidden ?? '—'}</strong>
        </StatCard>
        <StatCard>
          <span>Publicadas com denúncias</span>
          <strong>{stats?.reviews.publishedWithOpenReports ?? '—'}</strong>
        </StatCard>
        <StatCard tone={stats?.reports.PENDING ? 'warn' : 'neutral'}>
          <span>Denúncias na fila / pendentes</span>
          <strong>{stats?.reports.PENDING ?? '—'}</strong>
        </StatCard>
        <StatCard tone='danger'>
          <span>Análises removidas</span>
          <strong>{stats?.reviews.removed ?? '—'}</strong>
        </StatCard>
        <StatCard>
          <span>Limite para ocultar</span>
          <strong>{stats ? `${stats.threshold} den.` : '—'}</strong>
        </StatCard>
      </StatsGrid>

      <Tabs role='tablist'>
        {TABS.map((t) => (
          <Tab key={t.key} role='tab' aria-selected={tab === t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Tab>
        ))}
      </Tabs>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : tab === 'PENDING_REPORTS' ? (
        <PendingReports items={pending} busy={busy === 'republish'} onRepublish={republish} />
      ) : queue.length === 0 ? (
        <EmptyState>
          {tab === 'HIDDEN'
            ? 'Nenhuma análise aguardando decisão. Quando uma análise atingir o limite de denúncias, o worker a oculta e ela aparece aqui.'
            : 'Nada por aqui.'}
        </EmptyState>
      ) : (
        <List>
          {queue.map((item) => (
            <ReviewItem key={item.reviewId}>
              <ReviewTop>
                <div>
                  <h3>{item.title}</h3>
                  <small>
                    por <strong>@{item.author.username}</strong> · jogo #{item.gameId}
                    {item.rating ? ` · ${'★'.repeat(item.rating)}` : ''}
                    {item.hidden_at ? ` · ocultada em ${formatDate(item.hidden_at)}` : ''}
                  </small>
                </div>
                <Badge tone={item.status === 'HIDDEN' ? 'warn' : item.status === 'REMOVED' ? 'danger' : 'neutral'}>
                  {item.status === 'HIDDEN' ? 'Oculta' : item.status === 'REMOVED' ? 'Removida' : 'Publicada'} · {item.reports_count}{' '}
                  denúncia(s) abertas
                </Badge>
              </ReviewTop>

              {item.body && <ReviewBody>{item.body}</ReviewBody>}

              <TableScroll>
                <ReportsTable>
                  <thead>
                    <tr>
                      <th>Denunciante</th>
                      <th>Motivo</th>
                      <th>Detalhes</th>
                      <th>Situação</th>
                      <th>Quando</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.reports.map((r) => (
                      <tr key={r.id}>
                        <td>@{r.reporter.username}</td>
                        <td>{REASON_LABEL[r.reason]}</td>
                        <td>{r.details ?? '—'}</td>
                        <td>
                          <Badge tone={statusTone(r.status)}>{REPORT_STATUS_LABEL[r.status]}</Badge>
                        </td>
                        <td>{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </ReportsTable>
              </TableScroll>

              {item.status !== 'REMOVED' && (
                <Actions>
                  <ActionButton kind='keep' disabled={busy === item.reviewId} onClick={() => decide(item, 'KEEP')}>
                    Manter análise
                  </ActionButton>
                  <ActionButton kind='remove' disabled={busy === item.reviewId} onClick={() => decide(item, 'REMOVE')}>
                    Remover análise
                  </ActionButton>
                </Actions>
              )}
            </ReviewItem>
          ))}
        </List>
      )}
    </AdminMain>
  );
};

function PendingReports({ items, busy, onRepublish }: { items: IReportRecord[]; busy: boolean; onRepublish: () => void }) {
  return (
    <ReviewItem as='div'>
      <ReviewTop>
        <div>
          <h3>Denúncias ainda não processadas pelo worker</h3>
          <Hint>
            Normalmente ficam aqui só alguns segundos. Se o worker estiver parado, elas esperam na fila do RabbitMQ. Se o RabbitMQ
            estava fora do ar no momento da denúncia, ela foi salva com o erro abaixo — use “Reenviar” quando o broker voltar.
          </Hint>
        </div>
        <ActionButton kind='ghost' disabled={busy || items.length === 0} onClick={onRepublish}>
          {busy ? 'Reenviando...' : 'Reenviar pendentes'}
        </ActionButton>
      </ReviewTop>

      {items.length === 0 ? (
        <EmptyState>Nenhuma denúncia pendente. Tudo processado.</EmptyState>
      ) : (
        <TableScroll>
          <ReportsTable>
            <thead>
              <tr>
                <th>Denúncia</th>
                <th>Motivo</th>
                <th>Criada</th>
                <th>Envios ao broker</th>
                <th>Último erro</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>
                    <code>{r.id.slice(-8)}</code>
                  </td>
                  <td>{REASON_LABEL[r.reason]}</td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>{r.publish_attempts}</td>
                  <td>{r.last_publish_error ? <Badge tone='danger'>{r.last_publish_error}</Badge> : <Badge tone='ok'>na fila</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </ReportsTable>
        </TableScroll>
      )}
    </ReviewItem>
  );
}

export default AdminModerationPage;
