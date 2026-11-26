import { combineReducers } from '@reduxjs/toolkit';

import { constructorSlice } from './slices/constructorSlice';
import { feedSlice } from './slices/feedSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { ordersSlice } from './slices/ordersSlice';
import { userSlice } from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  feed: feedSlice.reducer,
  orders: ordersSlice.reducer,
  user: userSlice.reducer,
});
