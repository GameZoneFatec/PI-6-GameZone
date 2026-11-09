/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ICreateUser, IUserContextProps } from '@interfaces/users.interface';
import { createContext } from 'react';

export const UserContext = createContext<IUserContextProps>({
  createUser: function (_data: ICreateUser): Promise<void> {
    throw new Error('Function not implemented.');
  }
});
