import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthServiceConstants } from './auth.service.constants';
import { catchError, map } from 'rxjs/operators';
import { AuthHelper } from '../../helpers/auth.helper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = false;

  constructor(private readonly http: HttpClient) {
    const localStorageCreds = AuthHelper.getCredentialsFromLocalStorage();
    if (localStorageCreds && localStorageCreds.expires_at > Date.now()) {
      this.authenticated = true;
    }
  }

  setAuthenticatedState(state: boolean) {
    this.authenticated = state;
  }

  logout() {
    localStorage.removeItem(AuthServiceConstants.ACCESS_TOKEN_LS_KEY);
    localStorage.removeItem(AuthServiceConstants.REFRESH_TOKEN_LS_KEY);
    localStorage.removeItem(AuthServiceConstants.EXPIRES_AT_LS_KEY);
    this.authenticated = false;
  }

  login(credentials: { username: string; password: string }) {
    return this.http
      .post(AuthServiceConstants.TOKEN_ENDPOINT, credentials)
      .pipe(
        map((response: any) => {
          const payload = {
            access_token: '',
            refresh_token: '',
            expires_at: -1,
          };

          const access_token = response?.access_token as string;
          const refresh_token = response?.refresh_token as string;
          const expires_at = response?.expires_at as number;

          if (access_token && refresh_token && expires_at) {
            localStorage.setItem(
              AuthServiceConstants.ACCESS_TOKEN_LS_KEY,
              access_token
            );
            localStorage.setItem(
              AuthServiceConstants.REFRESH_TOKEN_LS_KEY,
              refresh_token
            );
            localStorage.setItem(
              AuthServiceConstants.EXPIRES_AT_LS_KEY,
              expires_at.toString()
            );

            payload.access_token = access_token;
            payload.refresh_token = refresh_token;
            payload.expires_at = expires_at;

            this.authenticated = true;
          }
          return payload;
        }),
        catchError((error) => {
          console.error(error);
          this.authenticated = false;
          return of({ access_token: '', refresh_token: '', expires_at: -1 });
        })
      );
  }

  getUserDetails(access_token: string) {
    return this.http
      .get(AuthServiceConstants.USER_DETAILS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((response: any) => {
          return response as User;
        }),
        catchError((error) => {
          console.error(error);
          return of({} as User);
        })
      );
  }

  isAuthenticated(): boolean {
    const localStorageCreds = AuthHelper.getCredentialsFromLocalStorage();
    if (localStorageCreds && localStorageCreds.expires_at > Date.now()) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
    return this.authenticated;
  }

  getProjectUsers(access_token: string, projectId: string) {
    return this.http
      .get(AuthServiceConstants.getProjectUsersEndpoint(projectId), {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((response: any) => {
          return response as User[];
        }),
        catchError((error) => {
          console.error(error);
          return of([] as User[]);
        })
      );
  }

  registerProjectUser(access_token: string, projectId: string, user: User) {
    return this.http
      .post(AuthServiceConstants.getProjectUsersEndpoint(projectId), user, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((response: any) => {
          return response as User;
        }),
        catchError((error) => {
          console.error(error);
          return of({} as User);
        })
      );
  }

  deleteProjectUser(access_token: string, projectId: string, userId: string) {
    return this.http
      .delete(
        AuthServiceConstants.getProjectUsersDeleteEndpoint(projectId, userId),
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .pipe(
        map((response: any) => {
          return response as User;
        }),
        catchError((error) => {
          console.error(error);
          return of({} as User);
        })
      );
  }
}
