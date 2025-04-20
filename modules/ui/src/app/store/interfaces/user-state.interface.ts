export interface UserState {
  loading: boolean;
  loaded: boolean;
  userMap: Map<string, User[]>;
}
