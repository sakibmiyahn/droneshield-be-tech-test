import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import type { ThunkAction, AnyAction } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define AppThunk type for async actions
export type AppThunk = ThunkAction<void, RootState, unknown, AnyAction>;

// Typed hooks
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
