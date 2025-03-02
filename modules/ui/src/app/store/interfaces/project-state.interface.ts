export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: any;
  loaded: boolean;
  currentProject?: Project;
}
