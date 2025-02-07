import {createSelector} from '@ngrx/store';
import {AppState, AuthState} from '../interfaces';

export const selectAuthState = (state: AppState) => state.auth;

export const selectTokens = createSelector(
  selectAuthState,
  (state: AuthState) => state.credentials
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);


