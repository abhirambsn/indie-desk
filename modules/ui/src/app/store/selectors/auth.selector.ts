import { createSelector } from '@ngrx/store';

import { AppState, AuthState } from '@ui/app/store/interfaces';

export const selectAuthState = (state: AppState) => state.auth;

export const selectTokens = createSelector(
  selectAuthState,
  (state: AuthState) => state.credentials,
);

export const selectError = createSelector(selectAuthState, (state: AuthState) => state.error);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated,
);

export const selectUser = createSelector(selectAuthState, (state: AuthState) => state.user);
