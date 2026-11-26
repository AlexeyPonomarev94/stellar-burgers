import { RequestError } from '@components';
import { selectIngredientsState } from '@slices/ingredientsSlice';
import { fetchUserOrders, selectOrdersState } from '@slices/ordersSlice';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, isLoaded, error } = useSelector(selectOrdersState);
  const ingredients = useSelector(selectIngredientsState);
  useEffect(() => {
    void dispatch(fetchUserOrders());
  }, [dispatch]);
  if (
    isLoading ||
    (!isLoaded && !error) ||
    ingredients.isLoading ||
    (!ingredients.isLoaded && !ingredients.error)
  )
    return <Preloader />;
  if (error) return <RequestError message={error} />;
  if (ingredients.error) return <RequestError message={ingredients.error} />;

  return <ProfileOrdersUI orders={orders} />;
};
