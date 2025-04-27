import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, of, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, map } from 'rxjs/operators';

import { ClientService } from '@ui/app/service/client/client.service';
import { ClientActions } from '@ui/app/store/actions';
import { AppState } from '@ui/app/store/interfaces';
import { AuthSelectors } from '@ui/app/store/selectors';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(ClientService);
  private readonly store$ = inject<Store<AppState>>(Store);

  loadClients$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClientActions.loadClients, ClientActions.saveClientSuccess),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([, { access_token }]) =>
        this.service.getClients(access_token).pipe(
          map((clients) => ClientActions.loadClientsSuccess({ payload: clients })),
          catchError((err) => of(ClientActions.loadClientsFailure({ error: err }))),
        ),
      ),
    );
  });

  saveClient$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClientActions.saveClient),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.createClient(payload, access_token).pipe(
          map((client) => ClientActions.saveClientSuccess({ payload: client })),
          catchError((err) => of(ClientActions.saveClientFailure({ error: err }))),
        ),
      ),
    );
  });

  updateClient$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClientActions.updateClient),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.updateClient(payload?.data, access_token).pipe(
          map((client) => ClientActions.saveClientSuccess({ payload: client })),
          catchError((err) => of(ClientActions.saveClientFailure({ error: err }))),
        ),
      ),
    );
  });

  deleteClient$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClientActions.deleteClient),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.deleteClient(payload?.id, access_token).pipe(
          map((client) => ClientActions.saveClientSuccess({ payload: client })),
          catchError((err) => of(ClientActions.saveClientFailure({ error: err }))),
        ),
      ),
    );
  });
}
