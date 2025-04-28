import { User } from 'indiedesk-common-lib';
export interface AuthState {
  credentials: { access_token: string; refresh_token: string; expires_at: number };
  error: string;
  loading: boolean;
  loaded: boolean;
  isAuthenticated: boolean;
  user: User;
}
