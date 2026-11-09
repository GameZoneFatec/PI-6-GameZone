export interface ICreateReview {
  userId: string;
  gameId: number;
  title: string;
  body: string;
  isPublic: boolean;
  rating?: number | null;
  status: 'DRAFT' | 'PUBLISHED';
}

export interface IReviewListParam {
  gameId: number;
  page: number;
  limit: 4;
  userId: string;
}

export interface IReviewListUserParam {
  page: number;
  limit: number;
  status?: 'DRAFT' | 'PUBLISHED';
  title?: string;
}

export interface IDeleteReviewParam {
  reviewId: string;
}

export interface IReviewLikeParam {
  reviewId: string;
  userId: string;
}

export interface IReviewParam {
  userId: string;
  gameId: number;
}

export interface IReviewUpdateParam {
  userId?: string;
  gameId?: number;
  title?: string;
  body?: string;
  isPublic?: boolean;
  rating?: number | null;
  status?: 'DRAFT' | 'PUBLISHED';
}

// Responses Review

export interface IReviewResponse {
  reviewId: string;
  gameId: number;
  title: string;
  body: string;
  rating: number;
  status: string;
  isPublic: boolean;
  published_at: Date;
  author: {
    id: string;
    username: string;
    profile_image_url: string;
  };
  likedByUser: boolean;
  likesCount: number;
}

export interface IResponse2 {
  id: string;
  gameId: number;
  title: string;
  body: string;
  rating: number;
  status: string;
  isPublic: boolean;
  published_at: Date;
}

//

export interface IReviewContextProps {
  reviewLoading: boolean;
  reviewFeed: IReviewResponse[];
  reviewUser: IReviewResponse[];
  reviewByUser: IResponse2 | null;
  setReviewByUser: React.Dispatch<React.SetStateAction<IResponse2 | null>>;
  createReview: (data: ICreateReview) => Promise<void>;
  reviewUpdate: (data: IReviewUpdateParam, reviewId: string) => Promise<void>;
  reviewlistFeed: (data: IReviewListParam) => Promise<void>;
  reviewListByUser: (data: IReviewListUserParam, userId: string) => Promise<void>;
  deleteReview: (data: IDeleteReviewParam) => Promise<void>;
  CreateLike: (data: IReviewLikeParam) => Promise<void>;
  DeleteLike: (data: IReviewLikeParam) => Promise<void>;
  reviewByUserAndGame: (data: IReviewParam) => Promise<void>;
}
