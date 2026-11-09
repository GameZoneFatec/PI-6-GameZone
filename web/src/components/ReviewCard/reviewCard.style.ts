import { styled } from '@styles/stitches.config';

export const Card = styled('li', {
  listStyle: 'none',
  display: 'flex',
  alignItems: 'center',
  background: '#252545',
  borderRadius: '20px',
  padding: '20px 32px',
  gap: '24px',
  color: '#fff',
  maxWidth: '900px',
  width: '100%',

  border: '2px solid #8A2BE2',

  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.45)',
    background: '#2E2E54'
  },

  '&:active': {
    transform: 'translateY(0)'
  }
});

export const Avatar = styled('img', {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  background: '#d9d9d9',
  flexShrink: 0
});

export const Body = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1
});

export const Header = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px'
});

export const Title = styled('h2', {
  margin: 0,
  marginBottom: '4px',
  fontSize: '20px'
});

export const Stars = styled('div', {
  display: 'flex',
  gap: '2px',
  fontSize: '18px',
  color: '#FFE600'
});

export const CreatedBy = styled('span', {
  fontSize: '13px',
  color: '#D0CFEA',

  '& span': {
    fontWeight: 500
  }
});

export const Description = styled('p', {
  marginTop: '8px',
  marginBottom: '16px',
  fontSize: '14px',
  lineHeight: 1.5,

  height: '60px',
  overflow: 'hidden',

  display: '-webkit-box',
  WebkitLineClamp: '3',
  WebkitBoxOrient: 'vertical',

  wordBreak: 'break-word',
  overflowWrap: 'break-word'
});

export const Footer = styled('footer', {
  marginTop: 'auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '12px'
});

export const PublishDate = styled('span', {
  color: '#B7B7CC'
});

export const LikeButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',

  padding: '6px 10px',
  borderRadius: '999px',
  background: 'transparent',
  border: '1px solid #fff',
  color: '#fff',
  cursor: 'pointer',

  transition: '0.2s',

  '&:hover': {
    background: '#ffffff20'
  }
});

export const LikeCount = styled('span', {
  fontSize: '13px'
});
