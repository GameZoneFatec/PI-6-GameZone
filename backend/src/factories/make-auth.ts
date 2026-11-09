import { JwtToken } from '../infra/JWT-token';
import { AuthMiddleware } from '../Middleware/auth.middleware';
import { UserRepoPrisma } from '../infra/Repositories/prisma/Repositories/user-repo-prisma';
import { prisma } from '../infra/Repositories/prisma/client';

export const instanceToken = new JwtToken();

export const authMiddleware = new AuthMiddleware(instanceToken, new UserRepoPrisma(prisma));
