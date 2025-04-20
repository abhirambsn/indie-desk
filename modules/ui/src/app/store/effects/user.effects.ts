import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '@/app/service/auth/auth.service';
import { TicketActions, UserActions } from '../actions';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { AuthSelectors } from '../selectors';

@Injectable()
export class UserEffects {
  private readonly store$ = inject(Store<AppState>);
  private readonly actions$ = inject(Actions);
  private readonly service = inject(AuthService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers, UserActions.saveUserSuccess),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.getProjectUsers(access_token, payload.projectId).pipe(
          map((users) =>
            UserActions.loadUsersSuccess({
              payload: {
                projectId: payload.projectId,
                users,
              },
            })
          ),
          catchError((err) =>
            of(TicketActions.loadTicketsFailure({ error: err }))
          )
        )
      )
    )
  );

  saveUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.saveUser),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) => {
        const project_id = payload.projectId;
        const user = payload.user;
        return this.service
          .registerProjectUser(access_token, project_id, user)
          .pipe(
            map((user) =>
              UserActions.saveUserSuccess({
                payload: {
                  projectId: project_id,
                  user,
                },
              })
            ),
            catchError((err) => of(UserActions.saveUserFailure({ error: err })))
          );
      })
    )
  );
}
