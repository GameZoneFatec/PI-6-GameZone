import 'dotenv/config';
import { prisma } from '../infra/Repositories/prisma/client';

/**
 * Promove um usuário já cadastrado a ADMIN (acesso ao backoffice).
 * Uso: npm run admin:promote -- email@exemplo.com
 */
async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Uso: npm run admin:promote -- <email>');
        process.exit(1);
    }
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) {
        console.error(`Usuário com e-mail ${email} não encontrado. Cadastre-o primeiro pelo site/app.`);
        process.exit(1);
    }
    await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
    console.log(`${email} agora é ADMIN.`);
}

main().finally(() => prisma.$disconnect());
