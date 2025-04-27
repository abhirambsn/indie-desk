import { AuthServiceConstants } from '../service/auth/auth.service.constants';

export class AuthHelper {
  static getCredentialsFromLocalStorage() {
    const accessToken = localStorage.getItem(AuthServiceConstants.ACCESS_TOKEN_LS_KEY);
    const refreshToken = localStorage.getItem(AuthServiceConstants.REFRESH_TOKEN_LS_KEY);
    const expiresAt = localStorage.getItem(AuthServiceConstants.EXPIRES_AT_LS_KEY);

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: parseInt(expiresAt) * 1000,
    };
  }

  static getRoleLabel(role?: string): string {
    if (role === 'admin') return 'Administrator';
    else if (role === 'support') return 'Support User';
    else if (role === 'customer') return 'Customer';
    return 'Guest';
  }
}
