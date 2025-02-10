import {AuthState} from '../interfaces';

export const initialAuthState: AuthState = {
  credentials: {
    access_token: '',
    refresh_token: '',
    expires_at: -1
  },
  loading: false,
  loaded: false,
  isAuthenticated: false,
  error: '',
  user: {
    id: '',
    firstName: '',
    lastName: '',
    avatarUrl: '',
    email: '',
    org: {
      id: '',
      name: '',
      users: []
    },
    projects: []
  }
}
