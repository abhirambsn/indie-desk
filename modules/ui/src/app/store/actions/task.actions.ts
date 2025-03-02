import { createAction, props } from "@ngrx/store";

export const loadTasks = createAction('[TASK] Load Tasks', props<{ payload: any }>());
export const loadTasksSuccess = createAction('[TASK] Load Tasks Success', props<{ payload: any }>());
export const loadTasksFailure = createAction('[TASK] Load Tasks Failure', props<{ error: any }>());

export const saveTask = createAction('[TASK] Save Task', props<{ payload: any }>());
export const saveTaskSuccess = createAction('[TASK] Save Task Success', props<{ payload: any }>());
export const saveTaskFailure = createAction('[TASK] Save Task Failure', props<{ error: any }>());

export const updateTask = createAction('[TASK] Update Task', props<{ payload: any }>());

export const deleteTask = createAction('[TASK] Delete Task', props<{ payload: any }>());
export const deleteTaskSuccess = createAction('[TASK] Delete Task Success', props<{ payload: any }>());
export const deleteTaskFailure = createAction('[TASK] Delete Task Failure', props<{ error: any }>());