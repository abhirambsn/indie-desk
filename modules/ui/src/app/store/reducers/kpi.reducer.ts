import { createReducer, on } from '@ngrx/store';
import { KpiActions } from '@ui/app/store';
import { initialKpiState } from '../constants/kpi.constants';

export const kpiReducer = createReducer(
  initialKpiState,
  on(KpiActions.loadKpiMetrics, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(KpiActions.loadKpiMetricsSuccess, (state, { payload }) => ({
    ...state,
    kpis: payload,
    loading: false,
    loaded: true,
  })),
  on(KpiActions.loadKpiMetricsFailure, (state, { error }) => ({
    ...state,
    kpis: {},
    error,
    loading: false,
    loaded: false,
  })),
);
