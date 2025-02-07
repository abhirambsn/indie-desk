import {createReducer, on} from '@ngrx/store';
import {AppConstants} from '../constants';
import {AuthActions} from '../actions';

export const authReducer = createReducer(
  AppConstants.initialAppState,
  on(AuthActions.loginSuccess, (state, credentials) => ({
    ...state,
    auth: {
      credentials,
      error: '',
      isAuthenticated: true,
      loading: false,
      loaded: true,
    },
  })),
  on(AuthActions.loginFailure, (state, {error}) => ({
    ...state,
    auth: {
      credentials: {
        access_token: '',
        refresh_token: '',
        expires_at: -1
      },
      error,
      isAuthenticated: false,
      loading: false,
      loaded: false,
    }
  }))
);
