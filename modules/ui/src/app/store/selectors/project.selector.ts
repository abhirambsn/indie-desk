import { AppState } from "@/app/store";
import { createSelector } from "@ngrx/store";

export const selectProjectState = (state: AppState) => state.projects;

export const selectProjects = createSelector(
    selectProjectState,
    (state) => state.projects
);

export const selectProjectsLoading = createSelector(
    selectProjectState,
    (state) => state.loading
);

export const selectProjectsLoaded = createSelector(
    selectProjectState,
    (state) => state.loaded
);

export const selectCurrentProject = createSelector(
    selectProjectState,
    (state) => state.currentProject
);