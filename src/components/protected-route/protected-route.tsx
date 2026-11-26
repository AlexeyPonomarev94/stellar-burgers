import { selectIsAuthChecked, selectUser } from '@slices/userSlice';
import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

import type { Location } from 'react-router-dom';

export const ProtectedRoute = ({
  onlyGuest = false,
}: {
  onlyGuest?: boolean;
}): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  const from = (location.state as { from?: Location<unknown> } | null)?.from;

  if (!isAuthChecked) return <Preloader />;
  if (onlyGuest && user) {
    return <Navigate to={from ?? '/'} state={from?.state} replace />;
  }
  if (!onlyGuest && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
