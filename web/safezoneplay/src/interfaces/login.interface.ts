import type { loginSchema } from '@schemas/login.schema';
import type { JwtPayload } from 'jwt-decode';
import type z from 'zod';
import type { IGetUserDataResponse } from './users.interface';

type ILoginRequest = z.infer<typeof loginSchema>;

interface ILoginResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  premium: boolean;
  token: string;
}
interface ILoginContextProps {
  signIn: (data: ILoginRequest) => Promise<void>;
  userData: IGetUserDataResponse | null;
  setUserdata: React.Dispatch<React.SetStateAction<IGetUserDataResponse | null>>;
  userLoading: boolean;
  handleLogout: () => void;
}

interface IJWTToken extends JwtPayload {
  id: string;
}

export type { ILoginRequest, ILoginResponse, ILoginContextProps, IJWTToken };
