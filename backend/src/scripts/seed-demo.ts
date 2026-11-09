import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { prisma } from '../infra/Repositories/prisma/client';
import { HashBcrypt } from '../infra/hash-bycript';

/**
 * Prepara o banco para a APRESENTAÇÃO. Pode ser executado quantas vezes quiser:
 * sempre deixa tudo no mesmo estado inicial.
 *
 *   npm run seed:demo
 *
 * Cria/atualiza (credenciais lidas do .env):
 *  - Admin  (DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD) → acessa /admin
 *  - Jogador (DEMO_USER_EMAIL / DEMO_USER_PASSWORD)  → usuário comum, premium
 *  - 3 usuários da "comunidade" (sem login) e uma análise ofensiva com 2 denúncias já
 *    processadas. Na demo, a denúncia do Jogador é a 3ª → o worker oculta a análise
 *    → ela aparece no backoffice.
 */
const DEMO_GAME_ID = Number(process.env.DEMO_GAME_ID ?? 3498); // Grand Theft Auto V na RAWG
const hash = new HashBcrypt();

function required(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Defina ${name} no .env`);
    return v;
}

async function upsertUser(data: { email: string; username: string; name: string; password: string; role: 'USER' | 'ADMIN'; premium: boolean }) {
    const password = await hash.hashPassword(data.password);
    const fields = {
        username: data.username,
        name: data.name,
        password,
        role: data.role,
        premium: data.premium,
        plan_expires_at: data.premium ? new Date(Date.now() + 365 * 24 * 3600 * 1000) : null,
        email_verified: true,
        email_verified_at: new Date(),
    };
    return prisma.user.upsert({ where: { email: data.email }, update: fields, create: { email: data.email, ...fields } });
}

async function main() {
    // 1. Remove os usuários de teste automatizado (demo.*@example.com) e tudo que eles criaram
    const cleaned = await prisma.user.deleteMany({ where: { email: { startsWith: 'demo.', endsWith: '@example.com' } } });

    // 2. Contas para a apresentação
    const admin = await upsertUser({
        email: required('DEMO_ADMIN_EMAIL'),
        password: required('DEMO_ADMIN_PASSWORD'),
        username: 'admin_safeplay',
        name: 'Admin SafePlay',
        role: 'ADMIN',
        premium: true,
    });
    const jogador = await upsertUser({
        email: required('DEMO_USER_EMAIL'),
        password: required('DEMO_USER_PASSWORD'),
        username: 'jogador_demo',
        name: 'Jogador Demo',
        role: 'USER',
        premium: true, // premium para também poder escrever análises na demo
    });

    // 3. Comunidade fictícia (senhas aleatórias: ninguém faz login com elas)
    const community = [];
    for (const [username, name] of [
        ['troll_gamer', 'Troll Gamer'],
        ['ana_jogadora', 'Ana Jogadora'],
        ['pedro_speedrun', 'Pedro Speedrun'],
    ] as const) {
        community.push(
            await upsertUser({
                email: `${username}@safeplay.demo`,
                username,
                name,
                password: randomBytes(16).toString('hex'),
                role: 'USER',
                premium: true,
            }),
        );
    }
    const [troll, ana, pedro] = community as [typeof admin, typeof admin, typeof admin];

    // 4. Análises: uma boa (do Pedro) e uma ofensiva (do Troll) já com 2 denúncias
    await prisma.review.deleteMany({ where: { userId: { in: [troll.id, pedro.id, jogador.id] }, gameId: DEMO_GAME_ID } });

    await prisma.review.create({
        data: {
            userId: pedro.id,
            gameId: DEMO_GAME_ID,
            title: 'Mundo aberto incrível',
            body: 'A cidade é viva, a campanha é divertida e o online rende muitas horas com os amigos.',
            rating: 5,
            status: 'PUBLISHED',
            isPublic: true,
            published_at: new Date(),
        },
    });

    const offensive = await prisma.review.create({
        data: {
            userId: troll.id,
            gameId: DEMO_GAME_ID,
            title: 'Jogo lixo, quem gosta é burro',
            body: 'Só idiota perde tempo com isso. (texto fictício para demonstrar a moderação)',
            rating: 1,
            status: 'PUBLISHED',
            isPublic: true,
            published_at: new Date(),
            reports_count: 2,
        },
    });
    await prisma.reviewReport.createMany({
        data: [
            { reviewId: offensive.id, reporterId: ana.id, reason: 'OFFENSIVE', status: 'PROCESSED', processed_at: new Date(), publish_attempts: 1 },
            {
                reviewId: offensive.id,
                reporterId: pedro.id,
                reason: 'OTHER',
                details: 'Ofende quem joga',
                status: 'PROCESSED',
                processed_at: new Date(),
                publish_attempts: 1,
            },
        ],
    });

    console.log('Banco pronto para a demonstração:');
    console.log(`  - ${cleaned.count} usuário(s) de teste removidos`);
    console.log(`  - Admin:   ${admin.email} (role ADMIN)`);
    console.log(`  - Jogador: ${jogador.email} (usuário comum, premium)`);
    console.log(`  - Análise ofensiva "${offensive.title}" no jogo ${DEMO_GAME_ID} com 2/3 denúncias`);
    console.log('  As senhas estão no backend/.env (DEMO_ADMIN_PASSWORD / DEMO_USER_PASSWORD).');
}

main()
    .catch((err) => {
        console.error(err.message ?? err);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
