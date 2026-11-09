import { UserContext } from '@contexts/User.context';
import { useContext } from 'react';

const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
