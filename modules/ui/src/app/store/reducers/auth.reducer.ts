import {createReducer, on} from '@ngrx/store';
import {AuthActions} from '../actions';
import {initialAuthState} from '../constants/auth.constants';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSuccess, (state, credentials) => ({
    ...state,
    credentials,
    error: '',
    isAuthenticated: true,
    loading: false,
    loaded: true,
  })),
  on(AuthActions.loginFailure, (state, {error}) => ({
    ...state,
    credentials: {
      access_token: '',
      refresh_token: '',
      expires_at: -1
    },
    error,
    isAuthenticated: false,
    loading: false,
    loaded: false,
  })),
  on(AuthActions.loadUserDetails, (state, {payload}) => ({
    ...state,
    user: payload
  }))
);
