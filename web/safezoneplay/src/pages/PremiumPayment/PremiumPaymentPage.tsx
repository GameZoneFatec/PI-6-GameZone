import { Container } from '@styles/global';
import { PaymentContainer, PremiumPageMain, QrWrapper } from './style.premiumPayment';
import useAuth from '@hooks/useAuth';
import { Loading } from '@components/Loading/Loading.component';
import Button from '@components/Buttons/Buttons';
import { api } from '@services/api';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PremiumPaymentPage = () => {
  const { userData, userLoading } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);

  const navigate = useNavigate();

  const subscribePremium = async () => {
    try {
      const subscribeRequest = await api.post('/payment', {
        email: userData?.email,
        userId: userData?.id,
        type: 'pix'
      } as { email: string; userId: string; type: string });

      const qrCode = `data:image/png;base64,${subscribeRequest.data.qr_code_base64}`;
      setQrCodeUrl(qrCode);

      setPaymentId(subscribeRequest.data.paymentId);

      setCheckingStatus(true);
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  useEffect(() => {
    if (!paymentId) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/payment/status/${paymentId}`);

        const status = data?.status as string | undefined;

        if (!status) return;

        if (['approved'].includes(status)) {
          setPaymentApproved(true);
          setCheckingStatus(false);
          clearInterval(interval);
        }
      } catch (error) {
        handleAxiosErrors(error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentId]);

  useEffect(() => {
    if (!paymentApproved) return;

    const timeout = setTimeout(() => {
      navigate('/', { replace: true });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [paymentApproved]);

  return (
    <PremiumPageMain>
      <Container style={{ display: 'flex', justifyContent: 'center' }}>
        {userLoading ? (
          <Loading />
        ) : (
          <PaymentContainer>
            {!qrCodeUrl ? (
              <>
                <span className='tag'>Plano Premium</span>
                <h1>Hey, {userData?.username}</h1>
                <h2>Venha se juntar à comunidade premium</h2>

                <p className='description'>
                  Desbloqueie recursos exclusivos, avaliações em destaque e mais visibilidade para o seu perfil.
                </p>

                <ul className='benefits'>
                  <li>Avaliações em destaque na comunidade</li>
                </ul>

                <div className='priceRow'>
                  <span className='price'>
                    R$ <strong>09,90</strong>
                  </span>
                  <span className='period'>/ mês</span>
                </div>

                <Button onClick={subscribePremium}>SER PREMIUM</Button>
              </>
            ) : (
              <>
                {paymentApproved ? (
                  <>
                    <h2>Pagamento confirmado! ✅</h2>
                    <p>Sua conta será atualizada para premium em instantes.</p>
                  </>
                ) : (
                  <>
                    <h2>Escaneie o QR Code para pagar</h2>
                    <p>Depois de confirmar o pagamento, sua conta vira premium automaticamente.</p>

                    <QrWrapper>
                      <img src={qrCodeUrl} alt='QR Code para pagamento' />
                    </QrWrapper>

                    {checkingStatus && <p style={{ fontSize: 12, opacity: 0.7 }}>Estamos verificando o pagamento...</p>}
                  </>
                )}
              </>
            )}
          </PaymentContainer>
        )}
      </Container>
    </PremiumPageMain>
  );
};

export default PremiumPaymentPage;
