import { Container } from '@styles/global';
import { styled } from '@styles/stitches.config';

const StyledLoginPageContainer = styled('section', {
  backgroundImage: 'url("/images/backpic.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'top',
  backgroundRepeat: 'no-repeat',

  '.backdrop-container': {
    minHeight: '100vh',
    minWidth: '100vw',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  '.container-login-elements': {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    backdropFilter: 'blur(25px) saturate(200%)',
    WebkitBackdropFilter: 'blur(25px) saturate(200%)',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },

  img: {
    minHeight: '40%',
    minWidth: '40%',
    marginBottom: '32px'
  },

  '.logo-container': {
    display: 'flex',
    justifyContent: 'center'
  },

  form: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    button: {
      marginTop: '48px',
      maxWidth: '75%'
    }
  },

  [`& ${Container}`]: {
    width: '100%',
    maxWidth: '900px'
  },

  '.container-newUser': {
    marginTop: '16px'
  },

  p: {
    textAlign: 'center',
    color: '$whiteFixed',
    fontFamily: '$play',

    '& :hover': {
      color: '$brand4'
    }
  }
});

export default StyledLoginPageContainer;
