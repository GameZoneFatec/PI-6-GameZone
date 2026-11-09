# Mensageria: denúncia de análises

## Em uma frase
Quando alguém denuncia uma análise, a API registra a denúncia e manda uma mensagem para o RabbitMQ. Um worker consome a mensagem e conta as denúncias. Ao chegar a **3** (configurável), ele oculta a análise e ela entra na fila de moderação do backoffice. O admin decide se mantém ou remove.

## Por que assíncrono?
- O usuário recebe a resposta na hora (`202 Accepted`) e não espera a moderação.
- A regra de moderação fica isolada num processo próprio (o worker). Ela pode crescer, com filtro de palavras ou IA, por exemplo, sem deixar a API mais lenta.
- Se o worker estiver fora do ar, as denúncias **esperam na fila** e são processadas quando ele volta.

## Quem é quem
| Papel | Componente | Arquivo |
|---|---|---|
| Produtor | API (`POST /review/:reviewId/report`) | `backend/src/core/useCases/reviewReport/review-report-create.usecase.ts` |
| Broker | RabbitMQ 4 | `backend/docker-compose.yml` (serviço `rabbitmq`) |
| Consumidor | Worker de moderação (processo separado) | `backend/src/main/worker.ts` + `review-report-process.usecase.ts` |
| Quem acompanha o resultado | Backoffice, pela API (`/admin/moderation/*`) | `backend/src/application/routes/routes-admin.ts` |

## Topologia
```text
API ──publish──► exchange "safeplay.events" (topic, durável)
                     │ routing key: review.reported
                     ▼
            fila "moderation.review-reported" (durável) ──► worker (prefetch 1, ack manual)
                     │ mensagem rejeitada
                     ▼
     exchange "safeplay.dlx" ──► fila "moderation.review-reported.dlq"
```

## Contrato da mensagem (`review.reported` v1)
Propriedades AMQP: `persistent: true`, `contentType: application/json`, `messageId = reportId`, `appId: safeplay-api`.
```json
{
  "event": "review.reported",
  "version": 1,
  "reportId": "cm3x0a1b20000abcd1234efgh",
  "reviewId": "cm2zz9y8x0000wxyz5678ijkl",
  "reporterId": "6f1c2b9e-0d3a-4c8e-9a51-2f7d8e4b1c90",
  "reason": "OFFENSIVE",
  "occurredAt": "2026-11-09T17:00:00.000Z"
}
```
`reason`: `OFFENSIVE` | `SPAM` | `SPOILER` | `OTHER`.

## Ciclo de vida
| Denúncia (`ReviewReport.status`) | Significado |
|---|---|
| `PENDING` | Salva no banco e aguardando o worker |
| `PROCESSED` | Contada pelo worker (denúncia "aberta") |
| `ACCEPTED` | O admin removeu a análise |
| `DISMISSED` | O admin manteve a análise |

| Análise (`Review.status`) | Quem muda |
|---|---|
| `PUBLISHED` → `HIDDEN` | O **worker**, ao atingir `REPORT_THRESHOLD` denúncias abertas |
| `HIDDEN` → `PUBLISHED` | O **admin** com a decisão `KEEP` (o contador volta a 0) |
| `HIDDEN` → `REMOVED` | O **admin** com a decisão `REMOVE` |

Análises `HIDDEN` e `REMOVED` não aparecem mais no feed (`GET /review/list/feed`) e o autor não consegue republicá-las.

## Rastreabilidade (evidência para a banca)
O **id da denúncia** é o mesmo em todo o caminho:
1. Resposta da API: `{"reportId": "cm3x...", "queued": true}`
2. Log da API: `[report:cm3x...] publicada em review.reported`
3. Propriedade `messageId` da mensagem, que aparece no painel do RabbitMQ em http://localhost:15672
4. Log do worker: `[report:cm3x...] contabilizada: review ... tem 2/3 denúncias`, ou `... OCULTADA`
5. Banco: `ReviewReport.status = PROCESSED` e `processed_at` preenchido. No backoffice, em `GET /admin/moderation/reports`.

## Falhas e recuperação
| Cenário | O que acontece | Como verificar ou recuperar |
|---|---|---|
| **Worker parado** | As mensagens se acumulam na fila e as denúncias ficam `PENDING` | Painel do RabbitMQ (mensagens "Ready"). Ao religar o worker, tudo é processado |
| **RabbitMQ fora do ar** na hora da denúncia | A denúncia é **salva mesmo assim** (`PENDING`, `queued: false`), com `last_publish_error` preenchido | `GET /admin/moderation/reports?status=PENDING` e, quando o broker voltar, `POST /admin/moderation/reports/republish` |
| **Mensagem duplicada** (republicação ou reentrega) | O worker só processa denúncias `PENDING` (update atômico). Uma duplicata é ignorada | Log `já processada anteriormente` |
| **Mensagem inválida** | É rejeitada sem voltar para a fila e vai para a **DLQ** | Fila `moderation.review-reported.dlq` no painel |
| **Banco fora do ar** durante o processamento | A mensagem volta uma vez para a fila depois de `WORKER_RETRY_DELAY_MS`. Se falhar de novo, vai para a DLQ e a denúncia continua `PENDING` | Republicar pelo backoffice |
| **Mensagem chega depois da decisão do admin** | A decisão já resolveu a denúncia, então o worker a ignora | Log `já processada anteriormente` |

## Garantias e limitações (MVP)
- **Garantia "pelo menos uma vez":** a mensagem é persistente, a fila é durável, o publicador usa *publisher confirms* e o consumidor faz *ack* manual. Junto com a idempotência do worker, uma mensagem entregue duas vezes não é contada duas vezes.
- **Não há Outbox transacional.** A denúncia é gravada e só então publicada. Se a API cair entre esses dois passos, a denúncia fica `PENDING` e é recuperada pela republicação manual no backoffice. Não há republicação automática.
- **Um único worker** com `prefetch 1`. Vários workers em paralelo não foram testados.
- **A DLQ não é reprocessada automaticamente.** A recuperação acontece pelo banco: a denúncia continua `PENDING` e pode ser republicada.

## Testes
`cd backend && npm test` executa `backend/tests/review-report.spec.ts`, com o banco e o broker substituídos por versões em memória:
- **Caminho principal:** a publicação, a contagem, a ocultação no limite e a decisão do admin.
- **Entradas inválidas:** motivo inválido, `OTHER` sem descrição, denúncia da própria análise, denúncia duplicada, análise inexistente, decisão inválida e mensagem fora do contrato.
- **Falhas:** o broker fora do ar, a republicação depois que ele volta, a idempotência e a mensagem que chega atrasada.
