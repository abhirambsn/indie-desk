import { ProjectState } from '@ui/app/store';

export const initialProjectState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  loaded: false,
};
