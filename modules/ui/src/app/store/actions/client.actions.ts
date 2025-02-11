import {createAction, props} from '@ngrx/store';

export const loadClients = createAction(
  '[CLIENT] Load Clients'
);

export const loadClientsSuccess = createAction(
  '[CLIENT] Load Clients Success',
  props<{payload: any}>()
);

export const loadClientsFailure = createAction(
  '[CLIENT] Load Clients Failure',
  props<{error: any}>()
);
