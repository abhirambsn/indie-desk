import { createSelector } from "@ngrx/store";
import { AppState, TaskState } from "../interfaces";

export const selectTaskState = (state: AppState) => state.tasks;

export const selectTasksMap = createSelector(
    selectTaskState,
    (state) => state.taskMap
);

export const selectTasksLoading = createSelector(
    selectTaskState,
    (state) => state.loading
);

export const selectTasksLoaded = createSelector(
    selectTaskState,
    (state) => state.loaded
);

export const getTasks = (projectId: string) => createSelector(
    selectTaskState,
    (state: TaskState) => state.taskMap.get(projectId)
);

export const getTaskById = (projectId: string, taskId: string) => createSelector(
    selectTaskState,
    (state: TaskState) => state.taskMap.get(projectId)?.find(task => task.id === taskId)
);