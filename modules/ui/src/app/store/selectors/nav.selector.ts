import {AppState} from '../interfaces';
import {createSelector} from '@ngrx/store';

export const selectNavState = (state: AppState) => state.nav;

export const selectSidebarCollapsed = createSelector(
  selectNavState,
  (state) => state.sidebarCollapsed
);

export const selectActiveLink = createSelector(
  selectNavState,
  (state) => state.activeLink
);
