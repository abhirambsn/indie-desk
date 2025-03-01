import { createReducer, on } from '@ngrx/store';
import { initialClientsState } from '../constants/client.constants';
import { ClientActions } from '../actions';

export const clientReducer = createReducer(
  initialClientsState,
  on(ClientActions.loadClients, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(ClientActions.loadClientsSuccess, (state, { payload }) => ({
    ...state,
    clients: payload,
    loaded: true,
    loading: false,
  })),
  on(ClientActions.loadClientsFailure, (state) => ({
    ...state,
    loaded: false,
    loading: false,
  }))
);
