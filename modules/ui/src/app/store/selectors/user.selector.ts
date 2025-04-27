import { createSelector } from '@ngrx/store';

import { UserState } from '@ui/app/store/interfaces';

export const selectUserState = (state: any) => state.users;

export const selectUserMap = createSelector(selectUserState, (state: UserState) => state.userMap);

export const getUsers = (projectId: string) =>
  createSelector(selectUserState, (state: UserState) => state.userMap.get(projectId));
