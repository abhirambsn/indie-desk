import { ProjectState } from '@/app/store';

export const initialProjectState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  loaded: false,
};
