import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.email('O formato do email está incorreto').nonempty('O e-mail é obrigatório'),
    password: z.string().min(8, 'Confira a senha, min. 8 caracteres').nonempty('A senha é obrigatória')
  })
  .required();
