import { Wrapper, Logo } from './style.loading';
import logo from '@assets/sfp_logo.svg';

export const Loading = () => {
  return (
    <Wrapper>
      <Logo src={logo} alt='Loading...' />
    </Wrapper>
  );
};
