import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {ClientService} from '../../service/client/client.service';
import {ClientActions} from '../actions';
import {exhaustMap, of, withLatestFrom} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces';
import {AuthSelectors} from '../selectors';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(ClientService);
  private readonly store$ = inject<Store<AppState>>(Store);


  loadClients$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClientActions.loadClients),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([, {access_token}]) => this.service.getClients(access_token)
        .pipe(
          map(clients => ClientActions.loadClientsSuccess({payload: clients})),
          catchError(err => of(ClientActions.loadClientsFailure({error: err})))
        )
      )
    )
  });
}
