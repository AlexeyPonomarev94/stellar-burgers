import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { fetchIngredients } from '@slices/ingredientsSlice';
import { checkUser } from '@slices/userSlice';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location<unknown> } | null)
    ?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUser());
  }, [dispatch]);

  const closeModal = (): void => {
    if (background) {
      void navigate(-1);
      return;
    }
    const fallback = location.pathname.startsWith('/profile/orders')
      ? '/profile/orders'
      : location.pathname.startsWith('/feed')
        ? '/feed'
        : '/';
    void navigate(fallback, { replace: true });
  };

  const ingredientModal = (
    <Modal title="Детали ингредиента" onClose={closeModal}>
      <IngredientDetails />
    </Modal>
  );
  const orderModal = (
    <Modal title="Информация о заказе" onClose={closeModal}>
      <OrderInfo />
    </Modal>
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route element={<ProtectedRoute onlyGuest />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route
            path="/profile/orders/:number"
            element={
              <>
                <ProfileOrders />
                {orderModal}
              </>
            }
          />
        </Route>
        <Route
          path="/ingredients/:id"
          element={
            <>
              <ConstructorPage />
              {ingredientModal}
            </>
          }
        />
        <Route
          path="/feed/:number"
          element={
            <>
              <Feed />
              {orderModal}
            </>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={ingredientModal} />
          <Route path="/feed/:number" element={orderModal} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/orders/:number" element={orderModal} />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
