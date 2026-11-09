import { styled } from '@styles/stitches.config';

const Button = styled('button', {
  height: '3rem',
  backgroundColor: '$brand5',
  borderRadius: '32px',
  fontFamily: '$play',
  fontWeight: '$semibold',
  fontSize: '1.125rem',
  transition: '250ms',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '$brand4'
  },
  variants: {
    type: {
      loginButton: {
        width: '100%',

        '&:hover': {
          backgroundColor: '$brand4'
        }
      },
      moreResultsButton: {
        width: 'fit-content',
        padding: '2rem'
      }
    }
  }
});

export default Button;
