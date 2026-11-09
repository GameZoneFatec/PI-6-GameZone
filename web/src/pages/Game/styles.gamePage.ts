import { styled } from '@styles/stitches.config';

const StyledGamePageMain = styled('section', {
  width: '100%',
  minHeight: '100vh',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: 'linear-gradient(to bottom, rgba(10, 10, 20, 0) 0%, #11091A 30%), var(--bg-image)',
  transition: 'background-image 0.3s ease',
  backgroundColor: '$brand1',
  filter: 'brightness(1)',
  marginBottom: '10rem'
});

const StyledGameDetailsContainer = styled('section', {
  margin: '0 auto',
  maxWidth: '80%'
});

const StyledGameContainer = styled('div', {
  paddingTop: '10rem',
  display: 'flex',
  gap: '2rem'
});

const StyledGameTitle = styled('div', {
  marginBottom: '2rem',
  h1: {
    fontSize: '$title1',
    fontFamily: '$inter'
  }
});

const GameDescription = styled('div', {
  marginBottom: '$3',
  p: {
    textAlign: 'justify'
  }
});

const GameGallery = styled('div', {
  display: 'flex',
  margin: '0 auto',
  flexWrap: 'wrap',
  gap: '16px',
  justifyContent: 'center',
  marginBottom: '2rem',

  img: {
    width: '32%',
    height: '50%',
    borderRadius: '8px'
  }
});

const GameInfos = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
  width: '100%',

  '.column': {
    width: '25%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  '.minorDetails-title': {
    fontSize: '$subtitle4',
    fontFamily: '$inter',
    fontWeight: '$semibold',
    width: '100%'
  }
});

const GameAsideCard = styled('div', {
  height: 'fit-content',
  backgroundColor: '$brand2',
  borderRadius: '$rad1',
  maxWidth: '20%',
  position: 'sticky',
  top: '10rem',
  marginBottom: '1rem',

  p: { color: '$whiteFixed' },

  img: {
    maxWidth: '100%',
    width: '300px',
    height: '300px',
    borderRadius: '8px',
    objectFit: 'cover'
  },

  ul: {
    height: '100%',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    alignContent: 'center',

    '.backlog': {
      '& svg, p': {
        color: 'orange'
      }
    },
    '.playing': {
      '& svg, p': {
        color: 'purple'
      }
    },
    '.finished': {
      '& svg, p': {
        color: 'green'
      }
    },
    '.dropped': {
      '& svg, p': {
        color: 'red'
      }
    }
  },

  li: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      'p, svg': {
        color: '$brand4',
        transition: 'color 0.3s'
      }
    },

    '& svg': {
      width: '1.5rem',
      height: '1.5rem',
      color: '$brand5'
    }
  }
});

const ReviewContainer = styled('div', {
  marginTop: '3rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1.5rem',

  h2: {
    gridColumn: '1 / -1',
    marginBottom: '1rem',
    fontSize: '1.5rem',
    fontWeight: '600'
  },

  '.page-number': {
    color: '$brand5'
  },

  '.review-pagination': {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',

    button: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      backgroundColor: '$brand3',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      fontWeight: '500',

      '&:disabled': {
        backgroundColor: '#555',
        cursor: 'not-allowed'
      }
    }
  }
});

const ReviewButton = styled('button', {
  width: '90%',
  margin: '1.5rem auto 1rem auto', // centraliza
  padding: '0.9rem 1rem',

  borderRadius: '10px',

  background: 'transparent',
  border: '2px solid $brand4',
  color: '$whiteFixed',

  fontSize: '0.95rem',
  fontWeight: 600,
  letterSpacing: '0.5px',

  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  transition: '0.25s ease',

  '&:hover': {
    background: 'rgba(255,255,255,0.08)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
  },

  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  }
});

export {
  StyledGamePageMain,
  StyledGameDetailsContainer,
  StyledGameContainer,
  StyledGameTitle,
  GameDescription,
  GameGallery,
  GameInfos,
  GameAsideCard,
  ReviewContainer,
  ReviewButton
};
