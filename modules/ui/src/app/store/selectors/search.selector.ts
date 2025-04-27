import { createSelector } from '@ngrx/store';

import { AppState } from '@ui/app/store/interfaces';

export const selectSearchState = (state: AppState) => state.search;

export const getSearchQuery = createSelector(selectSearchState, (state) => state.query);
