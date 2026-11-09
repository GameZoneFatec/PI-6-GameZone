import 'dotenv/config';
import { prisma } from '../infra/Repositories/prisma/client';

/**
 * Plano B da apresentação (quando o site não consegue abrir a página do jogo, ex.: RAWG fora):
 * faz o Jogador denunciar uma análise PELA API, passando pelo fluxo real
 * (API → RabbitMQ → worker). Credenciais lidas do .env.
 *
 *   npm run demo:report                 → denuncia "Jogo lixo, quem gosta é burro"
 *   npm run demo:report -- "Mundo"      → denuncia a análise cujo título começa com "Mundo"
 */
const API = process.env.BASE_URL ?? 'http://localhost:3000';
const titlePrefix = process.argv[2] ?? 'Jogo lixo';

async function main() {
    const login = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: process.env.DEMO_USER_EMAIL, password: process.env.DEMO_USER_PASSWORD }),
    });
    if (!login.ok) throw new Error(`Login do Jogador falhou (${login.status}). A API está rodando? Rodou o seed:demo?`);
    const { token } = (await login.json()) as { token: string };

    const review = await prisma.review.findFirst({
        where: { title: { startsWith: titlePrefix }, author: { email: { endsWith: '@safeplay.demo' } } },
        orderBy: { created_at: 'desc' },
    });
    if (!review) throw new Error(`Nenhuma análise com título começando em "${titlePrefix}". Rode npm run seed:demo`);

    console.log(`Jogador denunciando: "${review.title}" (${review.reports_count} denúncia(s) até agora, status ${review.status})`);
    const res = await fetch(`${API}/review/${review.id}/report`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: 'OFFENSIVE' }),
    });
    console.log(`Resposta da API: ${res.status}`, await res.json());
    console.log('→ Olhe o terminal do worker e o backoffice em http://localhost:5173/admin');
}

main()
    .catch((err) => {
        console.error(err.message ?? err);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
