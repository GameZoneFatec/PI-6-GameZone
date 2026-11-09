import { styled } from '@styles/stitches.config';

const CardsContainer = styled('ul', {
  display: 'flex',
  gap: '16px',
  padding: '1rem',
  '&::-webkit-scrollbar': {
    height: '16px'
  },

  scrollbarColor: '#BAB195 #11091A',
  scrollbarWidth: 'thin',

  variants: {
    direction: {
      line: {
        overflowX: 'auto'
      },
      grid: {
        overflowX: 'unset',
        flexWrap: 'wrap'
      }
    }
  },

  defaultVariants: {
    direction: 'row'
  }
});

const Card = styled('li', {
  width: '12rem',
  height: '20rem',
  backgroundColor: '$brand2',
  borderRadius: '$rad3',
  padding: '12px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '$brand3',
    transform: 'scale(1.05)'
  }
});

const CardImage = styled('div', {
  marginBottom: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  img: {
    width: '168px',
    height: '174px',
    objectFit: 'cover',
    borderRadius: '4px',
    objectPosition: 'top'
  }
});

const CardInfos = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',

  small: {
    fontSize: '$text3'
  },

  '.gameTitle': {
    width: '100%',
    fontSize: '$subtitle3',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    fontWeight: 'bold',
    whiteSpace: 'normal',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    overflow: 'hidden'
  }
});

export { CardsContainer, Card, CardImage, CardInfos };
