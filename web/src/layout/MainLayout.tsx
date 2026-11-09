import NavBar from '@components/NavBar/NavBar';
import { StyledLayoutBody, StyledLayoutWrapper } from './styles.mainLayout';
import { Outlet } from 'react-router-dom';
import Footer from '@components/Footer/Footer';

const MainLayout = () => {
  return (
    <StyledLayoutWrapper>
      <NavBar />
      <StyledLayoutBody>
        <Outlet />
      </StyledLayoutBody>
      <Footer />
    </StyledLayoutWrapper>
  );
};

export default MainLayout;
