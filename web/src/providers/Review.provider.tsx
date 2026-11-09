import { ReviewContext } from '@contexts/Review.context';
import type { IDefaultProviderProp, IErrorResponse } from '@interfaces/providerProps.interface';
import type {
  ICreateReview,
  IDeleteReviewParam,
  IResponse2,
  IReviewLikeParam,
  IReviewListParam,
  IReviewListUserParam,
  IReviewParam,
  IReviewResponse,
  IReviewUpdateParam
} from '@interfaces/review.interface';
import { api } from '@services/api';
import handleAxiosErrors from '@utils/axiosErrorStandard';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ReviewProvider = ({ children }: IDefaultProviderProp) => {
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewFeed, setReviewFeed] = useState<IReviewResponse[]>([]);
  const [reviewUser, setReviewUser] = useState<IReviewResponse[]>([]);
  const [reviewByUser, setReviewByUser] = useState<IResponse2 | null>(null);

  const createReview = async (data: ICreateReview) => {
    try {
      await api.post('/review', data);
      toast.success('Review adicionado com sucesso!');
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      }
    }
  };

  const reviewUpdate = async (data: IReviewUpdateParam, reviewId: string) => {
    try {
      console.log('reviewID: ', reviewId);
      await api.put(`/review/update/${reviewId}`, data);
      toast.success('Review atualizada');
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const reviewlistFeed = async (data: IReviewListParam) => {
    const { userId, gameId, limit, page } = data;
    try {
      setReviewLoading(true);
      const getReview = await api.get(
        `/review/list/feed?gameId=${gameId}&page=${page}&limit=${limit}&userId=${userId}`
      );
      setReviewFeed(getReview.data);
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setReviewLoading(false);
    }
  };

  const reviewListByUser = async (data: IReviewListUserParam, userId: string) => {
    const { limit, page, status, title } = data;

    let url = `/review/list/user/${userId}?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (title) url += `&title=${title}`;

    try {
      setReviewLoading(true);
      const getReview = await api.get(url);
      setReviewUser(getReview.data);
    } catch (error) {
      handleAxiosErrors(error);
    } finally {
      setReviewLoading(false);
    }
  };

  const reviewByUserAndGame = async (data: IReviewParam) => {
    const { gameId, userId } = data;
    try {
      const review = await api.get(`/review/user/game?userId=${userId}&gameId=${gameId}`);
      console.log('resultado: ', review);
      setReviewByUser(review.data);
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const deleteReview = async (data: IDeleteReviewParam) => {
    const { reviewId } = data;
    try {
      await api.delete(`/review/${reviewId}`);
      toast.success('Review deletada com sucesso!');
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const CreateLike = async (data: IReviewLikeParam) => {
    const { reviewId, userId } = data;
    try {
      await api.post(`/reviewLike?reviewId=${reviewId}&userId=${userId}`);
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const DeleteLike = async (data: IReviewLikeParam) => {
    const { reviewId, userId } = data;
    try {
      await api.delete(`/reviewLike?reviewId=${reviewId}&userId=${userId}`);
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviewFeed,
        reviewLoading,
        reviewUpdate,
        createReview,
        reviewlistFeed,
        reviewUser,
        reviewListByUser,
        deleteReview,
        CreateLike,
        DeleteLike,
        reviewByUserAndGame,
        setReviewByUser,
        reviewByUser
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export default ReviewProvider;
