/* eslint-disable react-hooks/exhaustive-deps */
import LoginForm from '@components/Forms/LoginForm/LoginForm.component';
import RegisterForm from '@components/Forms/RegisterForm/RegisterForm.component';
import { Container } from '@styles/global';
import { useNavigate, useParams } from 'react-router-dom';
import StyledLoginPageContainer from './styles';
import logo from '@assets/sfp_logo.svg';
import useAuth from '@hooks/useAuth';
import { useEffect } from 'react';

const StartPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { userData, userLoading } = useAuth();

  useEffect(() => {
    if (userData) {
      if (userData.email_verified === false) {
        navigate('/verify-email');
      } else {
        navigate('/home');
      }
    }
  }, [userData, userLoading]);

  return (
    <StyledLoginPageContainer>
      <div className='backdrop-container'>
        <Container>
          <section className='container-login-elements'>
            <div className='logo-container'>
              <img src={logo} alt='logo' />
            </div>

            {type === 'login' ? (
              <LoginForm />
            ) : type === 'register' ? (
              <RegisterForm />
            ) : (
              <p>Hmmm... Parece que não já jogos por aqui!</p>
            )}
          </section>

          <section className='container-newUser'>
            {type === 'login' ? (
              <p>
                Não é usuário ainda? <a href='/start/register'>Cadastre-se aqui</a>
              </p>
            ) : (
              <p>
                Já é usuário? <a href='/start/login'>Faça login aqui</a>
              </p>
            )}
          </section>
        </Container>
      </div>
    </StyledLoginPageContainer>
  );
};

export default StartPage;
