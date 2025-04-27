import { createReducer, on } from '@ngrx/store';

import { ProjectActions } from '@ui/app/store';
import { initialProjectState } from '@ui/app/store/constants/project.constants';

export const projectReducer = createReducer(
  initialProjectState,
  on(ProjectActions.loadProjects, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(ProjectActions.loadProjectsSuccess, (state, { payload }) => ({
    ...state,
    projects: payload,
    loading: false,
    loaded: true,
  })),
  on(ProjectActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    projects: [],
    error,
    loading: false,
    loaded: false,
  })),
  on(ProjectActions.selectProject, (state, { payload }) => ({
    ...state,
    currentProject: state.projects.find((project) => project.id === payload),
  })),
);
