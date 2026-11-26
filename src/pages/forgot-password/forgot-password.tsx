import {
  clearUserError,
  requestPasswordReset,
  selectUserError,
  selectUserLoading,
} from '@slices/userSlice';
import { ForgotPasswordUI } from '@ui-pages';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const isLoading = useSelector(selectUserLoading);

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (isLoading) return;
    void dispatch(requestPasswordReset(email))
      .unwrap()
      .then(
        () => {
          void navigate('/reset-password', { replace: true });
        },
        () => undefined
      );
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? undefined}
      isLoading={isLoading}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
