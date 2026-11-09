import { styled } from '@styles/stitches.config';

export const AdminMain = styled('section', {
  width: '100%',
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '7rem 1rem 3rem',
  color: '$grey0',
  fontFamily: '$inter',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
});

export const PageHeader = styled('header', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '1rem',

  h1: { fontFamily: '$play', fontSize: '$title6', color: '$brand5' },
  p: { color: '$grey5', fontSize: '$text2', marginTop: '0.25rem' }
});

export const HeaderActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  fontSize: '$text3',
  color: '$grey5'
});

export const StatsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '0.75rem',
  '@bp1': { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }
});

export const StatCard = styled('div', {
  background: '#1c1b33',
  border: '1px solid $brand2',
  borderRadius: '$rad3',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',

  span: { fontSize: '$text3', color: '$grey5' },
  strong: { fontFamily: '$play', fontSize: '$title6', color: '$grey0', fontVariantNumeric: 'tabular-nums' },

  variants: {
    tone: {
      warn: { borderColor: '$alert', strong: { color: '$alert' } },
      danger: { borderColor: '$error', strong: { color: '#e07a7a' } },
      ok: { borderColor: '$success' },
      neutral: {}
    }
  },
  defaultVariants: { tone: 'neutral' }
});

export const Tabs = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  borderBottom: '1px solid $brand2',
  paddingBottom: '0.5rem'
});

export const Tab = styled('button', {
  background: 'transparent',
  border: '1px solid transparent',
  color: '$grey4',
  borderRadius: '999px',
  padding: '0.4rem 0.9rem',
  fontSize: '$text2',
  cursor: 'pointer',
  fontFamily: '$inter',
  '&:hover': { color: '$grey0', borderColor: '$brand3' },

  variants: {
    active: {
      true: { background: '$brand5', color: '$brand1', fontWeight: '$semibold', '&:hover': { color: '$brand1' } }
    }
  }
});

export const List = styled('ul', {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
});

export const ReviewItem = styled('li', {
  background: '#252545',
  borderRadius: '$rad4',
  border: '1px solid $brand2',
  padding: '1.25rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
});

export const ReviewTop = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '0.5rem',

  h3: { fontSize: '$subtitle4', fontWeight: '$semibold' },
  small: { color: '$grey5', fontSize: '$text3' }
});

export const ReviewBody = styled('p', {
  fontSize: '$text2',
  lineHeight: 1.5,
  color: '$grey2',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word'
});

export const Badge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  borderRadius: '999px',
  padding: '0.15rem 0.6rem',
  fontSize: '$text3',
  fontWeight: '$medium',
  whiteSpace: 'nowrap',

  variants: {
    tone: {
      warn: { background: '#c49b3f26', color: '#e3bd63' },
      danger: { background: '#a74c4c33', color: '#e07a7a' },
      ok: { background: '#4c7a6c33', color: '#8cc5b3' },
      neutral: { background: '#ffffff14', color: '$grey3' }
    }
  },
  defaultVariants: { tone: 'neutral' }
});

export const ReportsTable = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '$text3',

  'th, td': { textAlign: 'left', padding: '0.4rem 0.5rem', borderTop: '1px solid #ffffff14', verticalAlign: 'top' },
  th: { color: '$grey5', fontWeight: '$medium' },
  td: { color: '$grey2' }
});

export const TableScroll = styled('div', {
  width: '100%',
  overflowX: 'auto'
});

export const Actions = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: '0.5rem'
});

export const ActionButton = styled('button', {
  borderRadius: '999px',
  padding: '0.5rem 1.1rem',
  fontSize: '$text2',
  fontWeight: '$semibold',
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: '150ms',
  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },

  variants: {
    kind: {
      keep: { background: '$success', color: '$whiteFixed', '&:hover:not(:disabled)': { filter: 'brightness(1.15)' } },
      remove: { background: '$error', color: '$whiteFixed', '&:hover:not(:disabled)': { filter: 'brightness(1.15)' } },
      ghost: { background: 'transparent', color: '$grey1', borderColor: '$brand3', '&:hover:not(:disabled)': { borderColor: '$grey3' } }
    }
  }
});

export const EmptyState = styled('div', {
  border: '1px dashed $brand3',
  borderRadius: '$rad4',
  padding: '2.5rem 1rem',
  textAlign: 'center',
  color: '$grey5',
  fontSize: '$text2'
});

export const Hint = styled('p', {
  fontSize: '$text3',
  color: '$grey5',
  lineHeight: 1.5
});
