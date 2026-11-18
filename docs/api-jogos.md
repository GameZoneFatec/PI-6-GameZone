# API de jogos (catálogo próprio)

O SafePlay não depende de API externa. Os jogos ficam na tabela `Game` do nosso PostgreSQL, as imagens são servidas pela própria API em `/media`, e o catálogo é mantido pelo administrador no backoffice.

## De onde vieram os jogos
- **Importação única:** `npm run games:import` busca 36 jogos na loja pública da Steam, que não exige chave de API.
- **O que fica salvo:** o script grava os dados em [`backend/prisma/data/games.json`](../backend/prisma/data/games.json) e as imagens em `backend/media/games/<slug>/`. Cada jogo tem uma capa (`header.jpg`) e até 4 screenshots, e tudo vai para o Git.
- **Carregar no banco:** `npm run games:load`, ou o próprio `npm run seed:demo`, coloca o catálogo no banco **sem acessar a internet**.
- **Depois da importação:** a Steam não é mais consultada. Jogos novos entram pelo backoffice.

## Endpoints públicos (site e app)
Estes endpoints mantêm o mesmo formato da antiga integração com a RAWG, por isso o site não precisou mudar.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/games?page=1&pageSize=10&search=hades&genres=rpg,indie` | Lista os jogos, ordenados pela nota do Metacritic |
| GET | `/games/genres` | Lista os gêneros existentes no catálogo |
| GET | `/games/id?gameId=1&userId=<opcional>` | Detalhes do jogo. Com `userId`, informa também o status dele na biblioteca do usuário |
| GET | `/media/games/<slug>/header.jpg` | Imagens (estáticas) |

As URLs das imagens usam a variável `MEDIA_BASE_URL`, ou `BASE_URL` se ela estiver vazia. Para o app no celular, use o IP do PC na rede.

## Endpoints do backoffice (JWT + papel ADMIN)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/admin/games?search=&page=1&limit=20` | Lista os jogos com `cover_url`, `reviews_count` e `library_count` |
| POST | `/admin/games` | Cria um jogo e devolve **201** |
| PUT | `/admin/games/:id` | Edita um jogo. Só altera os campos enviados |
| DELETE | `/admin/games/:id` | Remove um jogo. Se ele tiver análises ou estiver na biblioteca de alguém, devolve **409** |

### Corpo do POST e do PUT
```json
{
  "name": "Jogo Fatec",
  "short_description": "Resumo (até 400)",
  "description": "Texto longo (até 8000)",
  "released": "2026-11-30",
  "metacritic": 88,
  "genres": ["Indie", "Ação"],
  "platforms": "PC, Android",
  "developers": ["Equipe GameZone"],
  "publishers": ["Fatec"],
  "website": "https://exemplo.com",
  "cover_image_base64": "data:image/png;base64,iVBOR..."
}
```
- **Campos de lista** (`genres`, `platforms`, `developers` e `publishers`): aceitam um array ou um texto separado por vírgula. Cada um aceita até 15 itens.
- **Capa:** JPG, PNG ou WEBP de até 2 MB. Na edição, enviar `null` remove a capa.
- **Slug:** é gerado a partir do nome. Se o nome se repetir, o slug ganha um número (`jogo-fatec-2`).

### Erros
| Status | Quando |
|---|---|
| 400 | Dados inválidos. A resposta traz `details: [{ field, message }]` |
| 401 | Requisição sem token |
| 403 | O usuário não é ADMIN |
| 404 | Jogo inexistente |
| 409 | Jogo em uso (tem análises ou está em alguma biblioteca) |
