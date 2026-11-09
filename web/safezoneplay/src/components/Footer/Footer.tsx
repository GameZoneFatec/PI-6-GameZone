import { Container } from '@styles/global';
import StyledFooter from './styles.footer';
import logo from '@assets/sfp_logo.svg';

const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <div className='footer-links'></div>
        <div className='footer-about'>
          <div className='footer-rights'>
            <img src={logo} alt='sfpLogo' />
            <p>
              © 2025 SafeZone Play. Todos os direitos reservados. Desenvolvido com carinho pela equipe SafeZone Play.
            </p>
          </div>

          <p className='footer-message'>
            SafeZone Play é uma comunidade gamer onde jogadores podem compartilhar suas experiências, acompanhar seus
            progressos e descobrir novos jogos. Nosso objetivo é criar um espaço seguro, divertido e conectado para
            todos os gamers.
          </p>
        </div>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
