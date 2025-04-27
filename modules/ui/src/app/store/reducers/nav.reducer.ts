import { createReducer, on } from '@ngrx/store';

import { NavActions } from '@ui/app/store/actions';
import { initialNavState } from '@ui/app/store/constants/nav.constants';

export const navReducer = createReducer(
  initialNavState,
  on(NavActions.toggleSidebarAction, (state) => ({
    ...state,
    sidebarCollapsed: !state.sidebarCollapsed,
  })),
  on(NavActions.setActiveLink, (state, { payload }) => ({
    ...state,
    activeLink: payload.activeLink,
  })),
);
