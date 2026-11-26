import {
  selectConstructorItems,
  selectConstructorPrice,
} from '@slices/constructorSlice';
import { clearOrder, createOrder, selectOrdersState } from '@slices/ordersSlice';
import { selectUser } from '@slices/userSlice';
import { BurgerConstructorUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const constructorItems = useSelector(selectConstructorItems);
  const price = useSelector(selectConstructorPrice);
  const { orderRequest, orderModalData, orderError } = useSelector(selectOrdersState);

  const onOrderClick = (): void => {
    if (orderRequest) return;
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun) return;
    const bunId = constructorItems.bun._id;
    void dispatch(
      createOrder([
        bunId,
        ...constructorItems.ingredients.map((ingredient) => ingredient._id),
        bunId,
      ])
    );
  };

  const closeOrderModal = (): void => {
    if (!orderRequest) dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      orderError={orderError}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
