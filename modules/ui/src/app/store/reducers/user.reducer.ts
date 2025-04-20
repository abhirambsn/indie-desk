import { createReducer, on } from '@ngrx/store';
import { initialUserState } from '../constants/user.constants';
import { UserActions } from '../actions';

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUsers, (state, { payload }) => {
    state.userMap.set(payload.projectId, []);
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(UserActions.loadUsersSuccess, (state, { payload }) => {
    state.userMap.set(payload.projectId, payload.users);
    return {
      ...state,
      loading: false,
      loaded: true,
    };
  }),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  }))
);
