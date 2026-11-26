import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

const saveTokens = (data: { accessToken: string; refreshToken: string }): void => {
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

const clearTokens = (): void => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const checkUser = createAsyncThunk<TUser | null>('user/check', async () => {
  if (!getCookie('accessToken') && !localStorage.getItem('refreshToken')) return null;

  try {
    if (!getCookie('accessToken')) await refreshToken();
    const data = await getUserApi();
    if (!data.success) throw new Error('Не удалось проверить авторизацию');
    return data.user;
  } catch {
    clearTokens();
    return null;
  }
});

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (credentials) => {
    const data = await loginUserApi(credentials);
    saveTokens(data);
    return data.user;
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (credentials) => {
    const data = await registerUserApi(credentials);
    saveTokens(data);
    return data.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (user) => {
    const data = await updateUserApi(user);
    if (!data.success) throw new Error('Не удалось обновить профиль');
    return data.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const data = await logoutApi();
  if (!data.success) throw new Error('Не удалось завершить сеанс на сервере');
  clearTokens();
});

export const requestPasswordReset = createAsyncThunk<void, string>(
  'user/requestPasswordReset',
  async (email) => {
    await forgotPasswordApi({ email });
    localStorage.setItem('resetPassword', 'true');
  }
);

export const resetPassword = createAsyncThunk<void, { password: string; token: string }>(
  'user/resetPassword',
  async (credentials) => {
    await resetPasswordApi(credentials);
    localStorage.removeItem('resetPassword');
  }
);

const userRequests = [
  checkUser,
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
] as const;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectUser: (state): TUser | null => state.user,
    selectIsAuthChecked: (state): boolean => state.isAuthChecked,
    selectUserLoading: (state): boolean => state.isLoading,
    selectUserError: (state): string | null => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addMatcher(isFulfilled(loginUser, registerUser, updateUser), (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addMatcher(isPending(...userRequests), (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(isFulfilled(...userRequests), (state) => {
        state.isLoading = false;
      })
      .addMatcher(isRejected(...userRequests), (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось выполнить запрос';
      });
  },
});

export const { clearUserError } = userSlice.actions;
export const { selectUser, selectIsAuthChecked, selectUserLoading, selectUserError } =
  userSlice.selectors;
