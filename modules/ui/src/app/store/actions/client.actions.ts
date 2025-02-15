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

export const saveClient = createAction(
  '[CLIENT] Save Client',
  props<{payload: any}>()
);

export const saveClientSuccess = createAction(
  '[CLIENT] Save Client Success',
  props<{payload: any}>()
);

export const saveClientFailure = createAction(
  '[CLIENT] Save Client Failure',
  props<{error: any}>()
);

export const updateClient = createAction(
  '[CLIENT] Update Client',
  props<{payload: any}>()
);

export const deleteClient = createAction(
  '[CLIENT] Delete Client',
  props<{payload: any}>()
);
