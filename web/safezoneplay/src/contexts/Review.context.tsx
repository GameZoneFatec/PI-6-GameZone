import type { IReviewContextProps } from '@interfaces/review.interface';
import { createContext } from 'react';

export const ReviewContext = createContext<IReviewContextProps>({} as IReviewContextProps);
