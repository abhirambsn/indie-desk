import { KpiState } from '../interfaces/kpi-state.interface';

export const initialKpiState: KpiState = {
  kpis: [],
  loading: false,
  loaded: false,
  error: null,
};
