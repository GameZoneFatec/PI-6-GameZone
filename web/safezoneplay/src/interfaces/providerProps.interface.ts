import { type ReactNode } from 'react';

interface IDefaultProviderProp {
  children: ReactNode;
}

interface IErrorResponse {
  message: string;
}

export type { IDefaultProviderProp, IErrorResponse };
