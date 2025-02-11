import {createReducer, on} from '@ngrx/store';
import {initialClientsState} from '../constants/client.constants';
import {ClientActions} from '../actions';

export const clientReducer = createReducer(
  initialClientsState,
  on(ClientActions.loadClientsSuccess, (state, {payload}) => ({
    ...state,
    clients: payload
  }))
);
