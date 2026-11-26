import { RequestError } from '@components';
import { selectIngredientsState } from '@slices/ingredientsSlice';
import { fetchOrder, selectOrdersState } from '@slices/ordersSlice';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number: orderNumber } = useParams();
  const number = Number(orderNumber);
  const {
    orderDetails: orderData,
    detailsLoading: isLoading,
    detailsError: error,
  } = useSelector(selectOrdersState);
  const ingredientsState = useSelector(selectIngredientsState);
  const { ingredients } = ingredientsState;
  useEffect(() => {
    void dispatch(fetchOrder(number));
  }, [dispatch, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (
    isLoading ||
    ingredientsState.isLoading ||
    (!ingredientsState.isLoaded && !ingredientsState.error)
  ) {
    return <Preloader />;
  }
  if (error) return <RequestError message={error} />;
  if (ingredientsState.error) return <RequestError message={ingredientsState.error} />;
  if (!orderInfo) return <Preloader />;

  return (
    <>
      <p className="text text_type_digits-default">#{String(number).padStart(6, '0')}</p>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
