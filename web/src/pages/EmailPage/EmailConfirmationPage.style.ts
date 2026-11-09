import { styled } from '@styles/stitches.config';

export const PageWrapper = styled('div', {
  flex: 1,
  background: '#11091a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 16px'
});

export const Card = styled('div', {
  width: '100%',
  maxWidth: '480px',
  background: 'linear-gradient(145deg, #1b1025, #0c0712)',
  borderRadius: '18px',
  padding: '28px 26px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.8)',
  color: '#ffffff'
});

export const Title = styled('h1', {
  margin: 0,
  fontSize: '22px',
  fontWeight: 700,
  marginBottom: '12px'
});

export const Description = styled('p', {
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.6,
  color: 'rgba(255,255,255,0.85)',
  marginBottom: '20px'
});

export const Highlight = styled('span', {
  color: '#f1b32b',
  fontWeight: 600
});

export const ButtonsRow = styled('div', {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  marginTop: '8px'
});

export const PrimaryButton = styled('button', {
  border: 'none',
  borderRadius: '999px',
  padding: '8px 22px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  background: '#f1b32b',
  color: '#1b1325',
  boxShadow: '0 6px 18px rgba(0,0,0,0.7)',

  '&:hover': {
    filter: 'brightness(1.05)'
  },

  '&:active': {
    transform: 'translateY(1px)'
  }
});

export const SecondaryButton = styled('button', {
  borderRadius: '999px',
  padding: '8px 18px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  background: '#2f2f4c',
  color: '#ffffff',
  border: 'none',

  '&:hover': {
    filter: 'brightness(1.05)'
  },

  '&:active': {
    transform: 'translateY(1px)'
  }
});
