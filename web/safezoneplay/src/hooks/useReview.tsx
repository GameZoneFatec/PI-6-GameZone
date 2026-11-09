import { ReviewContext } from '@contexts/Review.context';
import { useContext } from 'react';

const useReview = () => {
  return useContext(ReviewContext);
};

export default useReview;
