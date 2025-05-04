import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { KpiService } from '@ui/app/service/kpi/kpi.service';
import { AppState, AuthSelectors, KpiActions, KpiSelectors } from '@ui/app/store';
import { catchError, exhaustMap, filter, map, of, withLatestFrom } from 'rxjs';

@Injectable()
export class KpiEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(KpiService);
  private readonly store$ = inject(Store<AppState>);

  loadKpis$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KpiActions.loadKpiMetrics),
      withLatestFrom(
        this.store$.select(AuthSelectors.selectAuthState),
        this.store$.select(KpiSelectors.selectKpiState),
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filter(([, _, kpiState]) => !kpiState.loaded),
      exhaustMap(
        ([
          ,
          {
            credentials: { access_token },
            user: { username },
          },
        ]) =>
          this.service.getKpiMetrics(access_token, username).pipe(
            map((kpis) => KpiActions.loadKpiMetricsSuccess({ payload: kpis })),
            catchError((err) => of(KpiActions.loadKpiMetricsFailure({ error: err }))),
          ),
      ),
    );
  });
}
