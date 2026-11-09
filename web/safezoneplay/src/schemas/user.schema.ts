import { z } from 'zod';

const createUserSchema = z
  .object({
    email: z.email('Email deve ser no formato exemplo@mail.com.br'),
    name: z.string().nonempty('O nome é obrigatório'),
    password: z.string().nonempty('A senha é obrigatória'),
    username: z.string().nonempty('O username é obrigatório'),
    bio: z.string().optional(),
    confirmPassword: z.string().min(1, 'Confirmação obrigatória'),
    profile_image_url: z
      .any()
      .optional()
      .transform((val) => (val instanceof File ? val : undefined))
      .refine((file) => !file || ['image/jpeg', 'image/png'].includes(file.type), 'Apenas JPEG ou PNG são permitidos')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  });

export default createUserSchema;
