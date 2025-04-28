import { Task } from 'indiedesk-common-lib';
export interface TaskState {
  loading: boolean;
  loaded: boolean;
  taskMap: Map<string, Task[]>;
}
