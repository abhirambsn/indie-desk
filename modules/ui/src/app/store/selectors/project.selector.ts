import { createSelector } from '@ngrx/store';

import { AppState } from '@ui/app/store';

export const selectProjectState = (state: AppState) => state.projects;

export const selectProjects = createSelector(selectProjectState, (state) => state.projects);

export const selectProjectsLoading = createSelector(selectProjectState, (state) => state.loading);

export const selectProjectsLoaded = createSelector(selectProjectState, (state) => state.loaded);

export const selectCurrentProject = createSelector(
  selectProjectState,
  (state) => state.currentProject,
);
