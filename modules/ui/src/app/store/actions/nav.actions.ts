import {createAction, props} from '@ngrx/store';

export const toggleSidebarAction = createAction(
  '[Nav] Toggle Sidebar'
);

export const setActiveLink = createAction(
  '[Nav] Set Active Link',
  props<{payload: any}>()
);
