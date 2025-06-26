import { combineReducers } from '@reduxjs/toolkit';
import { reducer as appStateReducer } from '../slices/app-state';

export const rootReducer = combineReducers({
  appState: appStateReducer
});
