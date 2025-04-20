import { UserState } from "../interfaces/user-state.interface";

export const initialUserState: UserState = {
  loading: false,
  loaded: false,
  userMap: new Map<string, User[]>(),
}
