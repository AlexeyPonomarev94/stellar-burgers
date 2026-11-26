import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { logoutUser } from './userSlice';

import type { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  orderDetails: TOrder | null;
  detailsLoading: boolean;
  detailsError: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  isLoaded: false,
  error: null,
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  orderDetails: null,
  detailsLoading: false,
  detailsError: null,
};

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchUserOrders',
  getOrdersApi
);

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'orders/create',
  async (ingredients) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

export const fetchOrder = createAsyncThunk<TOrder, number>(
  'orders/fetchOrder',
  async (number) => {
    const data = await getOrderByNumberApi(number);
    const order = data.orders?.find((item) => item.number === number);
    if (!data.success || !order) throw new Error('Заказ не найден');
    return order;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
  },
  selectors: {
    selectOrdersState: (state): TOrdersState => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.isLoaded = true;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить историю заказов';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchOrder.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.orderDetails = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderDetails = action.payload;
        state.detailsLoading = false;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.error.message ?? 'Не удалось загрузить заказ';
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { clearOrder } = ordersSlice.actions;
export const { selectOrdersState } = ordersSlice.selectors;
