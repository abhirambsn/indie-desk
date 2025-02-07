import {createAction, props} from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{username: string, password: string}>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{access_token: string, refresh_token: string, expires_at: number}>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{error: string}>()
);
