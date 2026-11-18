import { NavLink } from 'react-router-dom';
import { styled } from '@styles/stitches.config';

const Nav = styled('nav', {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',

  a: {
    textDecoration: 'none',
    color: '$grey4',
    border: '1px solid $brand3',
    borderRadius: '$rad3',
    padding: '0.45rem 1rem',
    fontSize: '$text2',
    fontFamily: '$inter',
    '&:hover': { color: '$grey0', borderColor: '$grey3' }
  },
  'a.active': { background: '#1c1b33', color: '$brand5', borderColor: '$brand5', fontWeight: '$semibold' }
});

/** Alterna entre as seções do backoffice. */
export const AdminSectionNav = () => (
  <Nav aria-label='Seções do backoffice'>
    <NavLink to='/admin' end>
      Moderação
    </NavLink>
    <NavLink to='/admin/jogos'>Catálogo de jogos</NavLink>
  </Nav>
);
