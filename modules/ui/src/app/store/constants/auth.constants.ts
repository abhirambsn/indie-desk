import { AuthState } from '@ui/app/store/interfaces';

export const initialAuthState: AuthState = {
  credentials: {
    access_token: '',
    refresh_token: '',
    expires_at: -1,
  },
  loading: false,
  loaded: false,
  isAuthenticated: false,
  error: '',
  user: {
    id: '',
    first_name: '',
    last_name: '',
    avatar_url: '',
    username: '',
    email: '',
    org: {
      id: '',
      name: '',
      users: [],
    },
    projects: [],
  },
};
