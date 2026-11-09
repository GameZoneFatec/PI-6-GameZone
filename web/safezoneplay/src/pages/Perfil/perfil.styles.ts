import { styled } from '@styles/stitches.config';

export const Page = styled('div', {
  minHeight: '100vh',
  background: '#11091a',
  color: '#ffffff',
  padding: '32px 40px 48px',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
});

export const HeaderWrapper = styled('header', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '120px',
  marginBottom: '40px'
});

export const HeaderLeft = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '24px',
  flex: 1
});

export const Avatar = styled('img', {
  width: '160px',
  height: '160px',
  borderRadius: '999px',
  background: '#2f2f4c',
  flexShrink: 0,
  objectFit: 'cover'
});
export const UserInfo = styled('div', {
  maxWidth: '520px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

export const UserName = styled('h1', {
  fontSize: '24px',
  fontWeight: 700,
  margin: 0
});

export const MemberSince = styled('span', {
  fontSize: '11px',
  opacity: 0.8
});

export const Bio = styled('p', {
  margin: '8px 0 0',
  fontSize: '12px',
  lineHeight: 1.5,
  color: 'rgba(255,255,255,0.8)'
});

export const HeaderRight = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '32px'
});

export const StatsColumn = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  minWidth: '360px'
});

export const StatsBox = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 20px',
  minHeight: '50px',
  background: '#2f2f4c',
  borderRadius: '14px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.35)'
});

export const StatItem = styled('div', {
  textAlign: 'center',
  minWidth: '56px'
});

export const StatNumber = styled('div', {
  fontSize: '14px',
  fontWeight: 700
});

export const StatLabel = styled('div', {
  fontSize: '10px',
  opacity: 0.8
});

export const ButtonGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%'
});

export const SmallButton = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  borderRadius: '8px',
  background: '#2f2f4c',
  color: '#ffffff',
  fontSize: '11px',
  padding: '6px 14px',
  textAlign: 'center',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '110px',
  height: '26px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',

  '&:hover': {
    filter: 'brightness(1.1)'
  }
});

export const FavoriteBox = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: '16px',
  background: 'linear-gradient(145deg, #251330, #11091a)',
  border: '2px solid #a855f7',
  boxShadow: '0 0 0 3px rgba(168,85,247,0.4), 0 16px 32px rgba(0,0,0,0.8)'
});

export const FavoriteTitle = styled('span', {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '8px',
  color: '#e5d4ff',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
});

export const FavoriteCard = styled('div', {
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  padding: '4px',
  background: 'linear-gradient(145deg, #4b2a63, #2a1a3f)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',

  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: '0 0 14px rgba(128, 90, 213, 0.35)'
  }
});

export const FavoriteGameName = styled('div', {
  marginTop: '8px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#ffffff',
  textAlign: 'center',
  width: '100%'
});

export const FavoriteImage = styled('img', {
  width: '150px',
  height: '220px',
  objectFit: 'cover',
  display: 'block',
  cursor: 'pointer',
  borderRadius: '10px',
  transition: 'transform 0.25s ease, filter 0.25s ease',

  [`${FavoriteCard}:hover &`]: {
    transform: 'scale(1.05)',
    filter: 'brightness(1.06)'
  }
});

export const SectionTitle = styled('h2', {
  fontSize: '18px',
  margin: '0 0 12px'
});

export const TabRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px'
});

export const Tab = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  borderRadius: '999px',
  padding: '10px 34px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#ffffff',
  border: '1px solid transparent',
  transition: 'background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease',

  '&:hover': {
    transform: 'translateY(-1px)',
    filter: 'brightness(1.05)'
  },

  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
    filter: 'none',
    transform: 'none'
  },

  variants: {
    color: {
      jogando: { background: '#00b341' },
      backlog: { background: '#505050' },
      finalizado: { background: '#916C1E' },
      abandonado: { background: '#6E2013' },
      tudo: { background: '#3a3a3a' }
    },
    active: {
      true: {
        boxShadow: '0 0 0 2px #ffffff33',
        transform: 'translateY(-1px)'
      }
    }
  }
});

export const ReviewGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
  gap: '24px'
});

export const SearchRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '12px'
});

export const SearchInput = styled('input', {
  width: '480px',
  height: '32px',
  borderRadius: '999px',
  border: 'none',
  outline: 'none',
  padding: '0 16px',
  background: '#626970',
  color: '#ffffff',
  fontSize: '12px',

  '&::placeholder': {
    color: 'rgba(255,255,255,0.6)'
  }
});

export const SelectWrapper = styled('div', {
  position: 'relative'
});

export const Select = styled('select', {
  appearance: 'none',
  borderRadius: '999px',
  height: '32px',
  padding: '0 32px 0 16px',
  border: 'none',
  background: '#2f2f4c',
  color: '#ffffff',
  fontSize: '12px',
  cursor: 'pointer',
  outline: 'none',

  '&::-ms-expand': {
    display: 'none'
  },

  '&:after': {
    content: '',
    position: 'absolute'
  }
});

export const Divider = styled('div', {
  margin: '16px 0',
  height: '1px',
  background: 'rgba(255,255,255,0.12)'
});

export const CardsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '24px'
});

export const GameCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  cursor: 'pointer',
  gap: '6px',
  position: 'relative',

  transition: 'transform 0.18s ease, box-shadow 0.18s ease',

  '&:hover': {
    transform: 'scale(1.03)'
  }
});

export const GameImage = styled('img', {
  width: '210px',
  height: '260px',
  borderRadius: '6px',
  objectFit: 'cover',
  display: 'block'
});

export const GameTitle = styled('div', {
  marginTop: '4px',
  fontSize: '12px',
  fontWeight: 500,

  maxWidth: '210px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});
