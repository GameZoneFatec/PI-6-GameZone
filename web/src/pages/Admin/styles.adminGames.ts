import { styled } from '@styles/stitches.config';
import { ModalCard } from '@components/Modal/reviewModal/reviewModal.style';

export const Toolbar = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  alignItems: 'center',
  justifyContent: 'space-between',

  input: {
    flex: '1 1 260px',
    maxWidth: '420px',
    background: '#1c1b33',
    border: '1px solid $brand3',
    borderRadius: '999px',
    color: '$grey0',
    padding: '0.55rem 1rem',
    fontSize: '$text2',
    fontFamily: '$inter',
    '&:focus': { outline: 'none', borderColor: '$brand5' }
  },
  span: { color: '$grey5', fontSize: '$text3' }
});

export const PrimaryButton = styled('button', {
  background: '$brand5',
  color: '$brand1',
  border: 'none',
  borderRadius: '999px',
  padding: '0.55rem 1.2rem',
  fontWeight: '$semibold',
  fontSize: '$text2',
  cursor: 'pointer',
  '&:hover': { filter: 'brightness(1.08)' }
});

export const GameGrid = styled('ul', {
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '1rem'
});

export const GameTile = styled('li', {
  background: '#252545',
  border: '1px solid $brand2',
  borderRadius: '$rad4',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',

  img: { width: '100%', aspectRatio: '460 / 215', objectFit: 'cover', display: 'block', background: '#1c1b33' }
});

export const NoCover = styled('div', {
  width: '100%',
  aspectRatio: '460 / 215',
  display: 'grid',
  placeItems: 'center',
  background: '#1c1b33',
  color: '$grey5',
  fontSize: '$text3'
});

export const TileBody = styled('div', {
  padding: '0.85rem 1rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
  flex: 1,

  h3: { fontSize: '$text1', fontWeight: '$semibold', color: '$grey0', lineHeight: 1.3 },
  small: { color: '$grey5', fontSize: '$text3' }
});

export const Chips = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.3rem'
});

export const TileFooter = styled('div', {
  marginTop: 'auto',
  paddingTop: '0.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
  span: { color: '$grey5', fontSize: '$text3' }
});

export const Pager = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.75rem',
  color: '$grey4',
  fontSize: '$text3'
});

// ---------- Formulário ----------

export const FormCard = styled(ModalCard, {
  maxWidth: '760px',
  maxHeight: 'calc(100vh - 2rem)',
  margin: '0 1rem',
  padding: '20px 24px 16px',
  gap: '14px'
});

export const FormScroll = styled('div', {
  overflowY: 'auto',
  paddingRight: '4px'
});

export const FormGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '12px 16px',
  '@bp1': { gridTemplateColumns: '1fr 1fr' }
});

export const CoverPreview = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '1rem',

  img: { width: '184px', aspectRatio: '460 / 215', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ffffff22' },
  '> span': {
    width: '184px',
    aspectRatio: '460 / 215',
    display: 'grid',
    placeItems: 'center',
    border: '1px dashed #ffffff33',
    borderRadius: '8px',
    color: '#9a9ab0',
    fontSize: '13px'
  },
  div: { display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '13px', color: '#cfcfe0' },
  button: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: '1px solid #ffffff33',
    color: '#e07a7a',
    borderRadius: '999px',
    padding: '0.25rem 0.75rem',
    cursor: 'pointer'
  }
});
