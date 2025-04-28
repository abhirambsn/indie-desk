import { UserState } from '@ui/app/store/interfaces';
import { User } from 'indiedesk-common-lib';

export const initialUserState: UserState = {
  loading: false,
  loaded: false,
  userMap: new Map<string, User[]>(),
};
