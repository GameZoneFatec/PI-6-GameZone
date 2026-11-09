import type createUserSchema from '@schemas/user.schema';
import z from 'zod';

interface IUser {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  profile_image_url?: string | undefined;
  bio?: string | undefined;
  premium: boolean;
  created_at: Date;
}

type ICreateUser = z.infer<typeof createUserSchema>;

interface ICreateUserResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  profile_image_url: string | undefined;
  bio: string | undefined;
  premium: boolean;
  role: 'USER' | 'ADMIN';
}

interface IGetUserDataResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  profile_image_url?: string | null;
  bio: string | undefined;
  premium: boolean;
  favorite_GameId?: number | null;
  favorite_name?: string | null;
  favorite_url?: string | null;
  plan_expires_at: Date;
  email_verified: boolean;
  email_verified_at: Date;
  role: 'USER' | 'ADMIN';
}

interface IUserContextProps {
  createUser: (data: ICreateUser) => Promise<void>;
}

export type { IUser, ICreateUser, ICreateUserResponse, IGetUserDataResponse, IUserContextProps };
