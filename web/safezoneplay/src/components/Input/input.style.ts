import { styled } from '@styles/stitches.config';

const StyledInputContainer = styled('fieldset', {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '$play',
  width: '100%',

  label: { fontSize: '$subtitle4', color: '$whiteFixed', marginBottom: '4px' },

  '.inputErrorMessage': {
    color: '$error',
    fontWeight: '$medium',
    fontSize: '$subtitle4'
  },

  '.inputErrorStyle': {
    border: '2px solid $error',
    backgroundColor: '#a74c4c55'
  },

  p: {
    height: '12px'
  },

  input: {
    height: '3rem',
    width: '100%',
    backgroundColor: '$brand3',
    borderRadius: '2rem',
    padding: '0 1rem',
    color: '$brand4',
    fontSize: '$text1',
    border: '1px solid $brand4',
    transition: '250ms',

    '&::placeholder': {
      color: '$brand4',
      opacity: 0.7,
      fontStyle: 'italic'
    },

    '&:focus': {
      color: '$whiteFixed',
      backgroundColor: '$brand3',
      outline: 'none',
      border: '2px solid $brand4'
    },

    '&::file-selector-button': {
      backgroundColor: '$brand3',
      color: 'white',
      border: 'none',
      padding: '0.86rem',
      borderRadius: '2rem',
      cursor: 'pointer',
      transition: 'background 0.2s ease',

      '&:hover': {
        backgroundColor: '#4338ca'
      }
    }
  }
});

export default StyledInputContainer;
