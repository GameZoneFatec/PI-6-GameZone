import { styled } from '@styles/stitches.config';

export const Overlay = styled('div', {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999
});

export const ModalContent = styled('div', {
  width: '100%',
  maxWidth: '560px',
  background: '#120a1b',
  borderRadius: '24px',
  border: '2px solid #007bff',
  padding: '24px 28px 20px',
  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.7)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
});

export const Header = styled('header', {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
});

export const IconWrapper = styled('div', {
  width: '54px',
  height: '28px',
  borderRadius: '999px',
  border: '2px solid #d9d9d9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  color: '#d9d9d9'
});

export const Title = styled('h2', {
  flex: 1,
  margin: 0,
  fontSize: '20px',
  fontWeight: 500,
  color: '#f5f5f5'
});

export const CloseButton = styled('button', {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: '#ffd32a',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&:hover': {
    opacity: 0.8
  }
});

export const Divider = styled('div', {
  marginTop: '8px',
  height: '1px',
  width: '100%',
  background: '#3b3347'
});

export const TextArea = styled('textarea', {
  width: '100%',
  minHeight: '160px',
  borderRadius: '12px',
  border: 'none',
  padding: '14px 16px',
  resize: 'vertical',
  outline: 'none',
  fontSize: '14px',
  lineHeight: 1.5,
  color: '#f5f5f5',
  background: '#181625',
  marginTop: '0', 
  boxSizing: 'border-box',

  '&::placeholder': {
    color: '#6b6a7f'
  }
});

export const Footer = styled('div', {
  marginTop: '8px',
  display: 'flex',
  justifyContent: 'flex-end'
});

export const SaveButton = styled('button', {
  border: 'none',
  borderRadius: '10px',
  padding: '10px 28px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  background: '#f1b32b',
  color: '#1b1325',

  '&:hover': {
    filter: 'brightness(1.05)'
  },

  '&:active': {
    transform: 'translateY(1px)'
  }
});
