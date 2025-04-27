import { createReducer, on } from '@ngrx/store';

import { initialSearchState } from '@ui/app/store/constants/search.constants';
import { SearchActions } from '@ui/app/store/actions';

export const searchReducer = createReducer(
  initialSearchState,
  on(SearchActions.search, (state, { payload }) => ({
    ...state,
    query: payload.query,
  })),
  on(SearchActions.clearSearch, (state) => ({
    ...state,
    query: null,
  })),
  on(SearchActions.searchSuccess, (state, { payload }) => ({
    ...state,
    response: payload,
  })),
);
