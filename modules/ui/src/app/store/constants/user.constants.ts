import { UserState } from '@ui/app/store/interfaces';

export const initialUserState: UserState = {
  loading: false,
  loaded: false,
  userMap: new Map<string, User[]>(),
};
