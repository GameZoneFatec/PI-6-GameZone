import z from 'zod';

export const SchemaLogin = z.object({
    email: z.email(),
    password: z.string(),
});
