# Guia da demonstração

O passo a passo para preparar o ambiente e apresentar à banca. O tempo total é de 30 minutos: cerca de 5 de pitch, 20 de demonstração e 5 de fechamento.

## Antes de começar (uma vez por máquina)
1. Instale o **Node.js 20 ou mais recente** e o **Git**.
2. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/GameZoneFatec/PI-6-GameZone.git
   cd PI-6-GameZone
   npm --prefix backend install
   npm --prefix web install
   ```
3. Crie o `backend/.env` a partir do `backend/env.example`. Peça os valores reais a quem administra o projeto: as URLs do **Neon** e do **CloudAMQP**, a chave da **RAWG** e as senhas das contas de demonstração. **Nunca faça commit desse arquivo.**
4. Aplique as migrations no banco. Só é preciso na primeira vez ou quando houver migration nova:
   ```bash
   npm --prefix backend exec prisma migrate deploy
   ```

## No dia: subir o sistema (3 terminais)
| Terminal | Comando | Deve aparecer |
|---|---|---|
| 1. API | `npm --prefix backend run dev` | `App is listening on port 3000` |
| 2. Worker | `npm --prefix backend run worker:dev` | `[worker] aguardando mensagens em "moderation.review-reported"` |
| 3. Site | `npm --prefix web run dev` | `Local: http://localhost:5173/` |

Depois, deixe o banco no estado inicial da demonstração. Pode rodar quantas vezes precisar, por exemplo para ensaiar:
```bash
npm --prefix backend run seed:demo
```

Deixe abertos:
- **Navegador 1 (normal):** http://localhost:5173, logado como **Jogador**
- **Navegador 2 (anônimo):** http://localhost:5173/admin, logado como **Admin**
- **Painel do RabbitMQ:** CloudAMQP → instância GameZone → **RabbitMQ Manager** → aba **Queues**
- **O terminal do worker**, visível

## Contas
| Papel | E-mail | Senha |
|---|---|---|
| Admin | `admin@safeplay.demo` | em `DEMO_ADMIN_PASSWORD` no `backend/.env` |
| Jogador (usuário comum, premium) | `jogador@safeplay.demo` | em `DEMO_USER_PASSWORD` no `backend/.env` |

O `seed:demo` também cria três usuários da "comunidade": `troll_gamer`, `ana_jogadora` e `pedro_speedrun`. Ninguém faz login com eles. No jogo **GTA V** (id 3498), ele cria duas análises:
- "Mundo aberto incrível", uma análise normal;
- "Jogo lixo, quem gosta é burro", uma análise ofensiva que **já tem 2 de 3 denúncias**.

## Roteiro da demonstração
| # | O que fazer | O que a banca vê | Requisito |
|---|---|---|---|
| 1 | No site, como Jogador, abra o GTA V e mostre as análises da comunidade | O site do 4º semestre evoluído, com dados vindos da API | R01, R03 |
| 2 | Na análise "Jogo lixo...", clique em **⚑ Denunciar**, escolha "Ofensivo" e envie | O aviso "Denúncia enviada" | R04 (produtor) |
| 3 | Aponte para o terminal do worker | `[report:…] review … OCULTADA (3 denúncias) → fila de moderação` | R04 (consumidor e efeito) |
| 4 | Recarregue a página do jogo | A análise ofensiva sumiu | R04 (efeito observável) |
| 5 | No navegador do Admin (`/admin`) | Ela aparece em "Aguardando decisão" em até 5 segundos, com as 3 denúncias | R05 |
| 6 | Clique em **Remover análise** | O contador "Análises removidas" sobe | R05 (operação administrativa) |
| 7 | **No app Flutter**, mostre a mesma análise sumida e os mesmos dados | Os dados são consistentes entre as plataformas | R02 *(quando o app estiver pronto)* |

### Cenário de falha (pedido pela banca)
1. **Pare o worker** no terminal 2 com `Ctrl+C`.
2. No site, como Jogador, denuncie a análise "Mundo aberto incrível".
3. Mostre o **painel do RabbitMQ**: a fila `moderation.review-reported` tem 1 mensagem em *Ready*. No backoffice, a aba **Processamento pendente** mostra a denúncia aguardando o worker.
4. **Ligue o worker de novo** com `npm --prefix backend run worker:dev`. Ele processa a mensagem na hora (`1/3 denúncias`), e a aba pendente esvazia.
5. Explique que a denúncia nunca se perde: ela fica salva no banco e, se o RabbitMQ inteiro cair, pode ser reenviada pelo botão **Reenviar pendentes**. Os detalhes estão em [mensageria.md](mensageria.md).

### Entradas inválidas (se perguntarem)
- Denunciar a mesma análise duas vezes retorna **409**, "Você já denunciou esta análise".
- Logado como Jogador, abrir `/admin` redireciona para a home. Na API, a resposta é **403**.
- O resultado dos testes automatizados aparece com `npm --prefix backend test`.

## Checklist de véspera
- [ ] `npm --prefix backend run seed:demo` executado
- [ ] A chave da **RAWG** está no `.env`. Sem ela, a página do jogo não carrega
- [ ] Os dois logins (Admin e Jogador) foram testados
- [ ] A internet do local foi testada. Neon, CloudAMQP e RAWG estão na nuvem; leve um roteador do celular como reserva
- [ ] O ensaio coube em até 30 minutos
