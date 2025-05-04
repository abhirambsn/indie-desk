import { createSelector } from '@ngrx/store';
import { AppState } from '@ui/app/store';

export const selectKpiState = (state: AppState) => state.kpi;

export const selectKpiMetrics = createSelector(selectKpiState, (state) => state.kpis);

export const selectKpiLoading = createSelector(selectKpiState, (state) => state.loading);

export const selectKpiLoaded = createSelector(selectKpiState, (state) => state.loaded);

export const selectKpiError = createSelector(selectKpiState, (state) => state.error);
