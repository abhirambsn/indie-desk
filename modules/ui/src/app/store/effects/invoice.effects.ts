import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthSelectors, InvoiceActions, AppState } from '@ui/app/store';
import { InvoiceService } from '@ui/app/service/invoice/invoice.service';

@Injectable()
export class InvoiceEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(InvoiceService);
  private readonly store$ = inject<Store<AppState>>(Store);

  loadInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceActions.loadInvoices, InvoiceActions.saveInvoiceSuccess),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([, { access_token }]) =>
        this.service.getInvoices(access_token).pipe(
          map((invoices) => InvoiceActions.loadInvoicesSuccess({ payload: invoices })),
          catchError((err) => of(InvoiceActions.loadInvoicesFailure({ error: err }))),
        ),
      ),
    );
  });

  downloadInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceActions.downloadInvoice),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ id }, { access_token }]) =>
        this.service.downloadInvoice(id, access_token).pipe(
          map((invoice) => InvoiceActions.downloadInvoiceSuccess({ payload: invoice })),
          catchError((err) => of(InvoiceActions.downloadInvoiceFailure({ error: err }))),
        ),
      ),
    );
  });

  downloadInvoiceSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(InvoiceActions.downloadInvoiceSuccess),
        tap(({ payload }) => {
          console.log('[DEBUG] downloading invoice', payload);
          const url = window.URL.createObjectURL(payload);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'invoice.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }),
      );
    },
    { dispatch: false },
  );

  saveInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceActions.saveInvoice),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.createInvoice(payload, access_token).pipe(
          map((invoice) => InvoiceActions.saveInvoiceSuccess({ payload: invoice })),
          catchError((err) => of(InvoiceActions.saveInvoiceFailure({ error: err }))),
        ),
      ),
    );
  });

  updateInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceActions.updateInvoice),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.updateInvoice(payload?.data, access_token).pipe(
          map((client) => InvoiceActions.saveInvoiceSuccess({ payload: client })),
          catchError((err) => of(InvoiceActions.saveInvoiceFailure({ error: err }))),
        ),
      ),
    );
  });
}
