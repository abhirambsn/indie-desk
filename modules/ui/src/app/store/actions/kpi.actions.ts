import { createAction, props } from '@ngrx/store';

export const loadKpiMetrics = createAction('[KPI] Load KPI Metrics');

export const loadKpiMetricsSuccess = createAction(
  '[KPI] Load KPI Metrics Success',
  props<{ payload: any }>(),
);

export const loadKpiMetricsFailure = createAction(
  '[KPI] Load KPI Metrics Failure',
  props<{ error: any }>(),
);
