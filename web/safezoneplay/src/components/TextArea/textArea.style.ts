import { styled } from '@styles/stitches.config';

const TextAreaContainer = styled('fieldset', {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '$play',
  marginBottom: '12px',
  width: '100%',

  label: { fontSize: '$subtitle4', color: '$whiteFixed', marginBottom: '4px' },

  p: {
    height: '12px'
  },

  '.textAreaErrorMessage': {
    color: '$error',
    fontWeight: '$medium',
    fontSize: '$subtitle4'
  }
});

const TextAreaComponent = styled('textarea', {
  height: '3rem',
  width: '100%',
  resize: 'vertical',
  backgroundColor: '$brand2',
  borderRadius: '2rem',
  padding: '1rem',
  minHeight: '10rem',
  color: '$brand4',
  fontSize: '$text1',
  border: '1px solid $brand3',
  transition: '250ms',
  boxSizing: 'border-box',

  '&:focus': {
    color: '$whiteFixed',
    backgroundColor: '$brand3',
    outline: 'none',
    border: '2px solid $brand4'
  },

  '.textAreaErrorStyle': {
    border: '2px solid $error',
    backgroundColor: '#a74c4c55'
  }
});

export { TextAreaContainer, TextAreaComponent };
