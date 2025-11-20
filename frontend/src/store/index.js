import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import statisticReducer from './slices/statisticSlice';
import todoReducer from './slices/todoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    statistic: statisticReducer,
    todo: todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
