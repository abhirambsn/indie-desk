import { createReducer, on } from '@ngrx/store';

import { initialUserState } from '@ui/app/store/constants/user.constants';
import { UserActions } from '@ui/app/store/actions';

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
  })),
);
