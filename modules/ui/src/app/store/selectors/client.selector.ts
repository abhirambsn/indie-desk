import { createSelector } from '@ngrx/store';

import { AppState } from '@ui/app/store/interfaces';

export const selectClientState = (state: AppState) => state.clients;

export const selectClients = createSelector(selectClientState, (state) => state.clients);

export const selectCurrentClient = createSelector(
  selectClientState,
  (state) => state.currentClient,
);

export const selectClientLoading = createSelector(selectClientState, (state) => state.loading);

export const selectClientLoaded = createSelector(selectClientState, (state) => state.loaded);
