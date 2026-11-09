# API: denúncias e moderação

Base: `http://localhost:3000`. As rotas marcadas com 🔒 exigem `Authorization: Bearer <token>`, obtido em `POST /login`. As marcadas com 🛡️ exigem também que o usuário seja **ADMIN**.

Formato de erro, o mesmo em toda a API:
```json
{ "message": "Erro na validação da denúncia", "details": [{ "field": "reason", "message": "..." }] }
```

| Código | Quando |
|---|---|
| 400 | Dados inválidos |
| 401 | Sem token, ou token inválido ou expirado |
| 403 | O usuário não é admin |
| 404 | O recurso não existe |
| 409 | Duplicado: o usuário já denunciou esta análise |
| 422 | Regra de negócio: o autor denunciou a própria análise, a análise não está publicada etc. |

---

## 🔒 `POST /review/:reviewId/report`: denunciar análise
O denunciante é o usuário do token.

Body:
```json
{ "reason": "OFFENSIVE", "details": "texto opcional (obrigatório se reason = OTHER, máx. 500)" }
```
`reason`: `OFFENSIVE` | `SPAM` | `SPOILER` | `OTHER`.

**202 Accepted:**
```json
{
  "reportId": "cm3x...",
  "reviewId": "cm2z...",
  "status": "PENDING",
  "queued": true,
  "message": "Denúncia recebida e enviada para análise"
}
```
`queued: false` significa que o broker estava indisponível. A denúncia foi salva mesmo assim e será processada depois.

---

## 🛡️ `GET /admin/moderation/stats`
```json
{
  "reports": { "PENDING": 1, "PROCESSED": 4, "ACCEPTED": 2, "DISMISSED": 3 },
  "reviews": { "hidden": 1, "removed": 2, "publishedWithOpenReports": 2 },
  "threshold": 3
}
```

## 🛡️ `GET /admin/moderation/reviews?status=HIDDEN&page=1&limit=20`
A fila de moderação. `status`: `HIDDEN` (padrão; análises que o worker ocultou), `PUBLISHED` (publicadas que têm denúncias abertas) ou `REMOVED`.
```json
[
  {
    "reviewId": "cm2z...", "gameId": 3498, "title": "...", "body": "...", "rating": 1,
    "status": "HIDDEN", "reports_count": 3, "hidden_at": "2026-11-09T17:05:00.000Z",
    "author": { "id": "...", "username": "fulano" },
    "reports": [
      { "id": "cm3x...", "reason": "OFFENSIVE", "details": null, "status": "PROCESSED",
        "created_at": "...", "reporter": { "id": "...", "username": "ciclano" } }
    ]
  }
]
```

## 🛡️ `PATCH /admin/moderation/reviews/:reviewId`: decidir
Body: `{ "decision": "KEEP" }` ou `{ "decision": "REMOVE" }`

**200:**
```json
{ "reviewId": "cm2z...", "status": "PUBLISHED", "resolvedReports": 3 }
```
Retorna **422** se a análise não estiver aguardando moderação.

## 🛡️ `GET /admin/moderation/reports?status=PENDING&page=1&limit=20`
Lista as denúncias com `publish_attempts` e `last_publish_error`. Serve para acompanhar o processamento assíncrono. O `status` é opcional: `PENDING` | `PROCESSED` | `ACCEPTED` | `DISMISSED`.

## 🛡️ `POST /admin/moderation/reports/republish`
Republica no broker as denúncias que estão `PENDING` há mais de 30 segundos. É a recuperação para quando o broker caiu.
```json
{ "found": 2, "published": 2, "failed": 0 }
```

---

## Outras mudanças na API
- **`POST /login`** agora devolve também `role` (`USER` | `ADMIN`). Use esse campo para mostrar ou esconder o menu de admin.
- Agora exigem token 🔒: `POST/PUT/DELETE /review`, `POST/DELETE /reviewLike`, `POST/PUT/DELETE /profile` e `/profile/favorite/game`, `PUT /users/update/:id`, `DELETE /users/delete/:id` e `POST /payment`.
- **`POST /teste`**, que ativa o premium sem pagamento, passou a ser 🛡️ só para admin.
- Análises `HIDDEN` e `REMOVED` não podem ser editadas pelo autor (retorna 422).
