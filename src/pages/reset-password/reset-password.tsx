import {
  clearUserError,
  resetPassword,
  selectUserError,
  selectUserLoading,
} from '@slices/userSlice';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const error = useSelector(selectUserError);
  const isLoading = useSelector(selectUserLoading);
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (isLoading) return;
    void dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(
        () => {
          void navigate('/login', { replace: true });
        },
        () => undefined
      );
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error ?? undefined}
      isLoading={isLoading}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
