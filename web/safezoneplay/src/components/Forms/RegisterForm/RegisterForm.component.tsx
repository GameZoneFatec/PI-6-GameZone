import Button from '@components/Buttons/Buttons';
import { Input } from '@components/Input/Input.component';
import TextArea from '@components/TextArea/TextArea.component';
import { zodResolver } from '@hookform/resolvers/zod';
import useUser from '@hooks/useUser';
import type { ICreateUser } from '@interfaces/users.interface';
import createUserSchema from '@schemas/user.schema';
import { Controller, useForm } from 'react-hook-form';

const RegisterForm = () => {
  const { createUser } = useUser();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createUserSchema)
  });

  const formSubmit = async (data: ICreateUser) => {
    console.log('Dados validados:', data);

    createUser(data);
  };
  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Input label='Nome *' placeholder='Seu nome' type='text' {...register('name')} error={errors.name} />
      <Input
        label='Username *'
        placeholder='Seu SZ username'
        type='text'
        {...register('username')}
        error={errors.username}
      />
      <Input
        label='Email *'
        placeholder='email@exemplo.com.br'
        type='email'
        {...register('email')}
        error={errors.email}
      />
      <TextArea label='Bio' {...register('bio')} error={errors.bio} />
      <Controller
        name='profile_image_url'
        control={control}
        render={({ field }) => (
          <Input
            label='Imagem de perfil'
            type='file'
            accept='image/*'
            onChange={(e) => field.onChange(e.target.files?.[0] || undefined)}
          />
        )}
      />
      <Input label='Senha *' placeholder='Senha' type='password' {...register('password')} error={errors.password} />
      <Input
        label='Confirme a senha'
        placeholder='Confirme a senha'
        type='password'
        {...register('confirmPassword')}
        error={errors.confirmPassword}
      />
      <Button type={'loginButton'}>CADASTRAR</Button>
    </form>
  );
};

export default RegisterForm;
