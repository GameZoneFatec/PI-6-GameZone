import { styled } from '@styles/stitches.config';

const StyledFooter = styled('footer', {
  width: '100%',
  height: '8rem',
  backgroundColor: '$brand2',
  padding: '1rem',
  display: 'flex',
  alignItems: 'center',
  p: { fontSize: '$text3' },

  '.footer-about': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  '.footer-rights': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',

    p: {
      maxWidth: '325px'
    },

    img: { width: '150px' }
  },

  '.footer-message': {
    maxWidth: '505px'
  }
});

export default StyledFooter;
