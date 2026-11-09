/* eslint-disable react-hooks/exhaustive-deps */
import { Container } from '@styles/global';
import { useEffect, useRef, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { HeaderStyled, Nav, MenuContainer, NavLinks, NavItem } from './style';
import logo from '@assets/sfp_logo.svg';
import { SearchInput } from '@components/Input/Input.component';
import { GrGamepad, GrHomeRounded } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import useGames from '@hooks/useGames';
import useAuth from '@hooks/useAuth';

const NavBar = () => {
  const navigate = useNavigate();
  const { gameSearchValue, setGameSearchValue } = useGames();
  const { userData, userLoading, handleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    if (userLoading || !userData?.id) return;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > lastScroll.current && currentScroll > 50) {
        setHidden(true);
      } else if (currentScroll < lastScroll.current) {
        setHidden(false);
      }

      if (userData.premium == true) lastScroll.current = currentScroll <= 0 ? 0 : currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderStyled style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}>
      <Container>
        <Nav>
          <div className='nav-container-logo' onClick={() => navigate(`/home`)}>
            <img src={logo} alt='sfc_logo' />
          </div>
          <MenuContainer>
            <form
              onSubmit={() => {
                navigate(`/search/${gameSearchValue}`);
              }}
            >
              <SearchInput
                type='text'
                id='searchInput'
                placeholder='O que você está jogando hoje?'
                onChange={(event) => {
                  setGameSearchValue(event.target.value);
                }}
              />
            </form>
            <GiHamburgerMenu
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
          </MenuContainer>

          <NavLinks open={isOpen}>
            <NavItem>
              <a href='/home'>{<GrHomeRounded />}Home</a>
            </NavItem>
            <NavItem>
              <a href='/perfil'>{<GrGamepad />}Meus Jogos</a>
            </NavItem>
            <NavItem
            // onClick={() => {
            //   if (!userData?.email_verified) {
            //     toast.warning('Confirme o email para utilizar essa função', {
            //       style: { color: '#000', fontWeight: 'bold' }
            //     });
            //     return;
            //   }

            //   navigate('/perfil');
            // }}
            >
              {userData?.premium === false && (
                <NavItem>
                  <a href='/premium'>
                    <MdOutlineWorkspacePremium />
                    Area Premium
                  </a>
                </NavItem>
              )}
            </NavItem>
            <NavItem>
              <CgProfile />
              <p>Perfil</p>

              <div className='logout-dropdown'>
                <p onClick={() => handleLogout()}>Logout</p>
              </div>
            </NavItem>
          </NavLinks>
        </Nav>
      </Container>
    </HeaderStyled>
  );
};

export default NavBar;
