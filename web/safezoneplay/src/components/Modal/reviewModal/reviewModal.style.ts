import { styled } from '@styles/stitches.config';

export const Backdrop = styled('div', {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999
});

export const ModalCard = styled('div', {
  width: '100%',
  maxWidth: '720px',
  background: '#0c0b17',
  borderRadius: '16px',
  padding: '24px 32px 20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

export const ModalHeader = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const ModalTitle = styled('h2', {
  margin: 0,
  fontSize: '20px',
  fontWeight: 600
});

export const CloseButton = styled('button', {
  border: 'none',
  background: 'transparent',
  color: '#ffe600',
  fontSize: '20px',
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,

  '&:hover': {
    transform: 'scale(1.1)'
  }
});

export const ModalBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
});

export const FieldGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

export const FieldLabel = styled('label', {
  fontSize: '14px',
  color: '#f5f5ff'
});

export const TextInput = styled('input', {
  borderRadius: '8px',
  border: '1px solid #3a3955',
  background: '#19182b',
  padding: '10px 12px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',

  '&::placeholder': {
    color: '#7a7a9c'
  },

  '&:focus': {
    borderColor: '#ffe600'
  }
});

export const TextArea = styled('textarea', {
  borderRadius: '10px',
  border: '1px solid #3a3955',
  background: '#19182b',
  padding: '12px 14px',
  color: '#fff',
  fontSize: '14px',
  resize: 'vertical',
  outline: 'none',
  minHeight: '160px',

  '&::placeholder': {
    color: '#7a7a9c'
  },

  '&:focus': {
    borderColor: '#ffe600'
  }
});

export const StarsRow = styled('div', {
  display: 'flex',
  gap: '8px'
});

export const StarButton = styled('button', {
  border: 'none',
  background: 'transparent',
  fontSize: '26px',
  cursor: 'pointer',
  padding: 0,
  transition: 'transform 0.15s',

  '&[data-active="true"]': {
    color: '#ffe600'
  },

  '&[data-active="false"]': {
    color: '#44445f'
  },

  '&:hover': {
    transform: 'scale(1.1)'
  }
});

export const RadioGroup = styled('div', {
  display: 'flex',
  gap: '20px'
});

export const RadioOption = styled('label', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  cursor: 'pointer',

  '& input': {
    accentColor: '#ffe600',
    width: '16px',
    height: '16px'
  }
});

export const Select = styled('select', {
  borderRadius: '8px',
  border: '1px solid #3a3955',
  background: '#19182b',
  padding: '8px 12px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',

  '&:focus': {
    borderColor: '#ffe600'
  }
});

export const ModalFooter = styled('footer', {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '8px'
});

export const SaveButton = styled('button', {
  borderRadius: '999px',
  padding: '8px 18px',
  border: 'none',
  cursor: 'pointer',
  background: '#ffe600',
  color: '#141320',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'background 0.15s, transform 0.1s',

  '&:hover': {
    background: '#ffef7b',
    transform: 'translateY(-1px)'
  }
});

export const CancelButton = styled('button', {
  borderRadius: '999px',
  padding: '8px 16px',
  border: '1px solid #777699',
  background: 'transparent',
  color: '#e0e0ff',
  fontSize: '14px',
  cursor: 'pointer',

  '&:hover': {
    background: '#25243a'
  }
});

export const DeleteButton = styled('button', {
  borderRadius: '999px',
  padding: '8px 16px',
  border: '1px solid #ff4d4f',
  background: 'transparent',
  color: '#ff4d4f',
  fontSize: '14px',
  cursor: 'pointer',

  '&:hover': {
    background: '#3a1b1f'
  }
});

export const ErrorText = styled('span', {
  fontSize: '12px',
  color: '#ff6b6b'
});
