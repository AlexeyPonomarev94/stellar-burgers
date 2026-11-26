import { logoutUser, selectUserLoading } from '@slices/userSlice';
import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectUserLoading);

  const handleLogout = (): void => {
    if (!isLoading) void dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
