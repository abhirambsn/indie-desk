import {createAction, props} from '@ngrx/store';

export const search = createAction(
  '[SEARCH] Search Term Modified',
  props<{payload: any}>()
)

export const clearSearch = createAction(
  '[SEARCH] Clear Search'
)

export const searchSuccess = createAction(
  '[SEARCH] Search Success',
  props<{ payload: any }>()
)

export const searchFailure = createAction(
  '[SEARCH] Search Failed',
  props<{ error: any }>()
)
