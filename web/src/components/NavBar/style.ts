import { fadeIn } from '@styles/animations';
import { styled } from '@styles/stitches.config';

const HeaderStyled = styled('header', {
  backgroundColor: '$brand2',
  width: '100%',
  height: 'fit-content',
  padding: '8px 0',
  borderBottom: '1px solid $brand4',
  position: 'sticky',
  top: '0',
  left: '0',
  zIndex: '999',

  input: {
    maxWidth: '2'
  },

  transition: 'transform 0.2s ease, opacity 0.2s ease',
  backfaceVisibility: 'hidden',
  willChange: 'transform'
});

const Nav = styled('nav', {
  width: '100%',

  '.nav-container-logo': {
    width: 'fit-content',
    height: '6rem',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '1rem',
    cursor: 'pointer',

    img: {
      maxWidth: '100%'
    },

    '@bp1': {
      justifyContent: 'space-between',
      paddingBottom: 0
    }
  },

  '@bp1': {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  }
});

const MenuContainer = styled('div', {
  width: '100%',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  display: 'flex',
  gap: '16px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',

  form: {
    width: `100%`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    fieldset: {
      width: '80%'
    }
  },

  '& svg': {
    width: '2rem',
    height: '2rem',
    color: '$brand5',
    transition: 'color 0.3s',

    '&:hover': {
      color: '$brand3'
    },
    '@bp1': {
      display: 'none'
    }
  }
});

const NavLinks = styled('ul', {
  display: 'none',
  width: '100%',
  flexDirection: 'column',
  position: 'absolute',
  right: '0',
  backgroundColor: '$brand3',
  padding: '1rem',
  listStyle: 'none',
  margin: 0,
  gap: '1.5rem',
  borderRadius: '$rad2',

  a: { fontFamily: '$play' },

  variants: {
    open: {
      true: {
        display: 'flex',
        animation: `${fadeIn} 0.3s ease`
      }
    }
  },

  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  },

  '@bp1': {
    display: 'flex',
    flexDirection: 'row',
    position: 'static',
    width: 'fit-content',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  }
});

const NavItem = styled('li', {
  display: 'flex',
  alignItems: 'center',

  position: 'relative',

  '.profile-trigger': {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },

  '.logout-dropdown': {
    position: 'absolute',
    top: '40px',
    right: 0,
    background: '$brand1',
    color: '$whiteFixed',
    padding: '10px 15px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    opacity: 0,
    visibility: 'hidden',
    transition: '0.2s ease-in-out',
    boxShadow: '0 2px 9px rgba(0,0,0,0.15)',
    zIndex: 50
  },

  '&:hover .logout-dropdown': {
    opacity: 1,
    visibility: 'visible'
  },

  '& svg': {
    width: '20px',
    height: '20px',
    color: '$brand5',
    transition: 'color 0.3s',

    '&:hover': {
      color: '$brand3'
    }
  },

  '& a': {
    width: 'max-content',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'white',
    fontSize: '$text1',
    textDecoration: 'none',
    transition: 'color 0.3s',
    '&:hover': {
      color: '$brand5'
    }
  },

  '& p': {
    width: 'max-content',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5px',
    gap: '0.5rem',
    color: 'white',
    fontSize: '$text1',
    textDecoration: 'none',
    transition: 'color 0.3s',
    cursor: 'pointer',
    '&:hover': {
      color: '$brand5'
    }
  }
});

export { HeaderStyled, Nav, MenuContainer, NavLinks, NavItem };
