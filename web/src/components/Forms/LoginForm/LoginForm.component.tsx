import Button from '@components/Buttons/Buttons';
import { Input } from '@components/Input/Input.component';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@hooks/useAuth';
import type { ILoginRequest } from '@interfaces/login.interface';
import { loginSchema } from '@schemas/login.schema';
import { useForm } from 'react-hook-form';

const LoginForm = () => {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginRequest>({
    resolver: zodResolver(loginSchema)
  });

  const formSubmit = async (data: ILoginRequest) => {
    signIn(data);
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Input
        label='Email'
        placeholder='user@mailexample.com'
        type='email'
        {...register('email')}
        error={errors.email}
      />
      <Input label='Senha' placeholder='Sua senha' type='password' {...register('password')} error={errors.password} />
      <Button type={'loginButton'}>ENTRAR</Button>
    </form>
  );
};

export default LoginForm;
