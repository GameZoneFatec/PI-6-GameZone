/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ILoginContextProps, ILoginRequest } from '@interfaces/login.interface';
import type { IGetUserDataResponse } from '@interfaces/users.interface';
import { createContext, type SetStateAction } from 'react';

export const AuthContext = createContext<ILoginContextProps>({
  signIn: function (_data: ILoginRequest): Promise<void> {
    throw new Error('Function not implemented.');
  },
  userData: null,

  userLoading: false,
  setUserdata: function (_value: SetStateAction<IGetUserDataResponse | null>): void {
    throw new Error('Function not implemented.');
  },

  handleLogout: function (): void {
    throw new Error('Function not implemented.');
  }
});
