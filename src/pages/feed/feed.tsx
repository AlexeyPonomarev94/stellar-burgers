import { RequestError } from '@components';
import { fetchFeed, selectFeed } from '@slices/feedSlice';
import { selectIngredientsState } from '@slices/ingredientsSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, isLoaded, error } = useSelector(selectFeed);
  const ingredients = useSelector(selectIngredientsState);

  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  if (
    isLoading ||
    (!isLoaded && !error) ||
    ingredients.isLoading ||
    (!ingredients.isLoaded && !ingredients.error)
  ) {
    return <Preloader />;
  }
  if (error) return <RequestError message={error} />;
  if (ingredients.error) return <RequestError message={ingredients.error} />;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
