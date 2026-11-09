import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PageWrapper,
  Card,
  Title,
  Description,
  Highlight,
  ButtonsRow,
  PrimaryButton
} from './EmailConfirmationPage.style';
import axios from 'axios';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import { toast } from 'react-toastify';

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('token');
  }, [location.search]);

  const hasToken = !!token;

  function handleGoHome() {
    navigate('/home');
  }

  async function handleConfirmEmail() {
    console.log('token:', token);
    if (!token) return;

    const baseUrl = import.meta.env.VITE_BASE_URL;

    try {
      await axios.post(`${baseUrl}/auth/verify/email`, { token });
      toast.success('Email confirmado com sucesso!');
    } catch (error) {
      handleAxiosErrors(error);
    }

    navigate('/home');
  }

  return (
    <PageWrapper>
      <Card>
        <Title>Confirme seu e-mail</Title>

        {!hasToken ? (
          <>
            <Description>
              Enviamos um e-mail para você com um link de confirmação.
              <br />
              <Highlight>Abra seu e-mail</Highlight> e clique no link para finalizar seu cadastro.
            </Description>

            <ButtonsRow>
              <PrimaryButton type='button' onClick={handleGoHome}>
                OK
              </PrimaryButton>
            </ButtonsRow>
          </>
        ) : (
          <>
            <Description>
              Encontramos um pedido de confirmação da sua conta.
              <br />
              Clique em <Highlight>Confirmar e-mail</Highlight> para ativar seu acesso.
            </Description>

            <ButtonsRow>
              <PrimaryButton type='button' onClick={handleConfirmEmail}>
                Confirmar e-mail
              </PrimaryButton>
            </ButtonsRow>
          </>
        )}
      </Card>
    </PageWrapper>
  );
}
