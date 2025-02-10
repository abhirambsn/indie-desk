import {AppState} from '../interfaces';
import {createSelector} from '@ngrx/store';

export const selectSearchState = (state: AppState) => state.search;

export const getSearchQuery = createSelector(
  selectSearchState,
  (state) => state.query
);
