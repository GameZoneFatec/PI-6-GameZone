import type { IDefaultProviderProp } from '@interfaces/providerProps.interface';
import AuthProvider from './Auth.provider';
import UserProvider from './User.provider';
import GameProvider from './Game.provider';
import ReviewProvider from './Review.provider';

const MainProvider = ({ children }: IDefaultProviderProp) => {
  return (
    <AuthProvider>
      <UserProvider>
        <ReviewProvider>
          <GameProvider>{children}</GameProvider>
        </ReviewProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default MainProvider;
