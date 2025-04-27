import { createSelector } from '@ngrx/store';

import { AppState } from '@ui/app/store/interfaces';

export const selectNavState = (state: AppState) => state.nav;

export const selectSidebarCollapsed = createSelector(
  selectNavState,
  (state) => state.sidebarCollapsed,
);

export const selectActiveLink = createSelector(selectNavState, (state) => state.activeLink);
