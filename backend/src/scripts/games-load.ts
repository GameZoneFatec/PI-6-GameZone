import 'dotenv/config';
import { prisma } from '../infra/Repositories/prisma/client';
import { loadCatalog } from './lib/game-catalog';

/** Carrega o catálogo (prisma/data/games.json) no banco, sem acessar a internet. */
loadCatalog(prisma)
    .then((out) => console.log(`Catálogo carregado: ${out.total} jogos (${out.created} criados, ${out.updated} atualizados)`))
    .catch((err) => {
        console.error(err.message ?? err);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
