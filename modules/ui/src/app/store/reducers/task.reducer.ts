import { createReducer, on } from '@ngrx/store';
import { initialTaskState } from '@/app/store/constants/task.constants';
import { TaskActions } from '../actions';

export const taskReducer = createReducer(
  initialTaskState,
  on(TaskActions.loadTasks, (state, { payload }) => {
    state.taskMap.set(payload.projectId, []);
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(TaskActions.loadTasksSuccess, (state, { payload }) => {
    state.taskMap.set(payload.projectId, payload.tasks);
    return {
      ...state,
      loading: false,
      loaded: true,
    };
  }),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  }))
);
