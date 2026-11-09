import { styled } from '@styles/stitches.config';

export const PremiumPageMain = styled('section', {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  padding: '40px 0',
  justifyContent: 'center',

  background: 'radial-gradient(circle at top, #27264a 0, #0c0b16 45%, #05040a 100%)'
});

export const PaymentContainer = styled('div', {
  maxWidth: '520px',
  margin: '0 auto',
  background: '#18172b',
  borderRadius: '20px',
  padding: '28px 32px',
  boxShadow: '0 22px 45px rgba(0,0,0,0.7)',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',

  '.tag': {
    alignSelf: 'flex-start',
    padding: '4px 10px',
    borderRadius: '999px',
    background: '#ffe60020',
    color: '#ffe600',
    fontSize: '11px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontWeight: 600
  },

  h1: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 700
  },

  h2: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 500,
    color: '#d0cfff'
  },

  '.description': {
    marginTop: '8px',
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#b8b7d8'
  },

  '.benefits': {
    margin: 0,
    paddingLeft: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px',
    color: '#dcdaf5',

    '& li::marker': {
      color: '#ffe600'
    }
  },

  '.priceRow': {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
  },

  '.price': {
    fontSize: '18px',
    color: '#ffffff',

    '& strong': {
      fontSize: '26px',
      fontWeight: 700
    }
  },

  '.period': {
    fontSize: '13px',
    color: '#b8b7d8'
  },

  '.userId': {
    marginTop: '8px',
    fontSize: '11px',
    color: '#8c8bab'
  }
});

export const QrWrapper = styled('div', {
  marginTop: '12px',
  padding: '12px',
  borderRadius: '12px',
  background: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  img: {
    width: '240px',
    height: '240px',
    objectFit: 'contain'
  }
});
