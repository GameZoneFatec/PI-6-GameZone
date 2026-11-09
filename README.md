# SafePlay: Projeto Interdisciplinar (Lab. de Desenvolvimento Multiplataforma)

O SafePlay é uma plataforma para jogadores organizarem seus jogos (Backlog, Jogando, Finalizado, Dropado), escreverem análises e interagirem com a comunidade. Este repositório é a evolução do projeto do **4º semestre** para uma solução **multiplataforma**: site, app Flutter, backoffice, API e mensageria.

> Enunciado: [F290-LDMP/projeto-interdisciplinar](https://github.com/F290-LDMP/projeto-interdisciplinar)

## Estrutura (monorepo)
| Pasta | O que é | Stack |
|---|---|---|
| [`backend/`](backend) | API REST e **worker de moderação** (consumidor do RabbitMQ) | Node.js, TypeScript, Express 5, Prisma, PostgreSQL, RabbitMQ |
| [`web/`](web) | Site do usuário + **backoffice de moderação** em `/admin` (somente ADMIN) | React, Vite, TypeScript |
| `mobile/` | App Flutter *(em desenvolvimento)* | Flutter |
| [`docs/`](docs) | Documentação da API e da mensageria | Markdown |

## Origem: projeto do 4º semestre (R01)
| Parte | Repositório original | Versão de origem |
|---|---|---|
| Backend | [Rapha-Reiis/projeto-integrador-4-semestre-backend](https://github.com/Rapha-Reiis/projeto-integrador-4-semestre-backend) | tag `v4-semestre-backend` (commit `a257e7c`) |
| Frontend | [julianosantosdev/PI2025-2-frontend](https://github.com/julianosantosdev/PI2025-2-frontend) | tag `v4-semestre-frontend` (commit `1de65f3`) |

O histórico de commits dos dois projetos foi preservado. Para ver tudo o que mudou desde o 4º semestre:
```bash
git diff v4-semestre-backend HEAD -- backend
```

### Reaproveitado, adaptado e acrescentado
- **Reaproveitado:** cadastro e login, lista de jogos (RAWG), status dos jogos, análises, curtidas, premium via Pix.
- **Adaptado:** as rotas de escrita passaram a exigir JWT, o login devolve `role` e as rotas de admin são protegidas por papel.
- **Acrescentado:** a **denúncia de análises com RabbitMQ** (ver [docs/mensageria.md](docs/mensageria.md)), a API de moderação ([docs/api-moderacao.md](docs/api-moderacao.md)), o **backoffice web** em `/admin` (indicadores, fila de análises ocultadas pelo worker, decisão manter/remover e reenvio de denúncias pendentes, com atualização automática a cada 5 s), o botão **Denunciar** nas análises e os testes automatizados. *A seguir: o app Flutter.*

## Fluxo assíncrono (R04 e R05)
```text
App/Site ── POST /review/:id/report ──► API ──► RabbitMQ (review.reported) ──► Worker
                                          │                                     │ conta denúncias;
                                          ▼                                     │ 3 ou mais → oculta
                                     PostgreSQL ◄────────────────────────────────┘
                                          ▲
Backoffice ── GET/PATCH /admin/moderation/* (somente ADMIN)
```

## Como executar

### Pré-requisitos
- Node.js 20 ou mais recente
- Docker Desktop (para o PostgreSQL e o RabbitMQ)

### 1. Backend, banco, RabbitMQ e worker (Docker)
```bash
cd backend
cp env.example .env        # preencha os valores
docker compose up -d --build
```
Isso sobe o **PostgreSQL**, o **RabbitMQ** (painel em http://localhost:15672), a **API** (http://localhost:3000, que aplica as migrations ao iniciar) e o **worker**.

Para acompanhar o worker:
```bash
docker compose logs -f worker
```

### 1b. Backend sem Docker para a API (desenvolvimento)
Você ainda precisa do PostgreSQL e do RabbitMQ rodando, por exemplo com `docker compose up -d db rabbitmq`.
```bash
cd backend
npm install
npx prisma migrate deploy
npm run dev          # API
npm run worker:dev   # worker, em outro terminal
```

### 2. Criar um administrador
Cadastre o usuário pelo site e depois promova-o:
```bash
cd backend
npm run admin:promote -- admin@exemplo.com
```
Com o Docker, use `docker compose exec app node -e "..."` ou rode o comando acima com o `DATABASE_URL` apontando para `localhost`.

### 3. Site
```bash
cd web
npm install
npm run dev          # http://localhost:5173 (usa VITE_BASE_URL do .env.development)
```

### Testes
```bash
cd backend
npm test
```

## Variáveis de ambiente
Todas estão listadas em [`backend/env.example`](backend/env.example), sem segredos reais. **Nunca faça commit do `.env`.**

## Equipe
| Integrante | Principal contribuição |
|---|---|
| *(preencher)* | |
