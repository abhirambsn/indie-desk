import {Injectable, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AuthActions} from '../actions';
import {AuthService} from '../../service/auth/auth.service';
import {exhaustMap, map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(AuthService);
  private readonly router = inject(Router);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((payload) => this.service.login(payload)
        .pipe(
          map(loginResponse => {
            this.router.navigate(["/dashboard"]);
            return AuthActions.loginSuccess(loginResponse)
          }),
          catchError(() => of(AuthActions.loginFailure({error: 'Login Failed'})))
        )
      )
    )
  });

  loginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      exhaustMap((payload) => this.service.getUserDetails(payload.access_token)
        .pipe(
          map(userDetails => AuthActions.loadUserDetails({payload: userDetails})),
          catchError(() => of(AuthActions.userDetailError({error: 'Error loading user details'})))
        )
      )
    )
  });
}
