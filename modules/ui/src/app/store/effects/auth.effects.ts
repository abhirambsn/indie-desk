import {Injectable, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AuthActions} from '../actions';
import {AuthService} from '../../service/auth.service';
import {exhaustMap, map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(AuthService);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((payload) => this.service.login(payload)
        .pipe(
          map(loginResponse => AuthActions.loginSuccess(loginResponse)),
          catchError(() => of(AuthActions.loginFailure({error: 'Login Failed'})))
        )
      )
    )
  });
}
