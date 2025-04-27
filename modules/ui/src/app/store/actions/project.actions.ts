import { createAction, props } from '@ngrx/store';

export const loadProjects = createAction('[PROJECT] Load Projects');
export const loadProjectsSuccess = createAction(
  '[PROJECT] Load Projects Success',
  props<{ payload: any }>(),
);
export const loadProjectsFailure = createAction(
  '[PROJECT] Load Projects Failure',
  props<{ error: any }>(),
);

export const saveProject = createAction('[PROJECT] Save Project', props<{ payload: any }>());
export const saveProjectsuccess = createAction(
  '[PROJECT] Save Project Success',
  props<{ payload: any }>(),
);
export const saveProjectFailure = createAction(
  '[PROJECT] Save Project Failure',
  props<{ error: any }>(),
);

export const updateProject = createAction('[PROJECT] Update Project', props<{ payload: any }>());

export const deleteProject = createAction('[PROJECT] Delete Project', props<{ payload: any }>());
export const deleteProjectsuccess = createAction(
  '[PROJECT] Delete Project Success',
  props<{ payload: any }>(),
);
export const deleteProjectFailure = createAction(
  '[PROJECT] Delete Project Failure',
  props<{ error: any }>(),
);

export const selectProject = createAction('[PROJECT] Select Project', props<{ payload: any }>());
