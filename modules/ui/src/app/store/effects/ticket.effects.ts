import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';

import { AppState, AuthSelectors, TicketActions } from '@ui/app/store';
import { TicketService } from '@ui/app/service/ticket/ticket.service';

@Injectable()
export class TicketEffects {
  private readonly store$ = inject(Store<AppState>);
  private readonly actions$ = inject(Actions);
  private readonly service = inject(TicketService);

  loadTickets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TicketActions.loadTickets, TicketActions.saveTicketSuccess),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.getTickets(payload.projectId, access_token).pipe(
          map((tickets) =>
            TicketActions.loadTicketsSuccess({
              payload: { projectId: payload.projectId, tickets },
            }),
          ),
          catchError((err) => of(TicketActions.loadTicketsFailure({ error: err }))),
        ),
      ),
    );
  });

  saveTicket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TicketActions.saveTicket),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.createTicket(payload.projectId, access_token, payload.ticket).pipe(
          map((ticket) =>
            TicketActions.saveTicketSuccess({
              payload: { projectId: payload.projectId, ticket },
            }),
          ),
          catchError((err) => of(TicketActions.saveTicketFailure({ error: err }))),
        ),
      ),
    );
  });

  updateTicket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TicketActions.updateTicket),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service
          .updateTicket(payload.projectId, access_token, payload.ticket.id, payload.ticket)
          .pipe(
            map((ticket) =>
              TicketActions.saveTicketSuccess({
                payload: { projectId: payload.projectId, ticket },
              }),
            ),
            catchError((err) => of(TicketActions.saveTicketFailure({ error: err }))),
          ),
      ),
    );
  });
}
