import { TaskState } from '@ui/app/store/interfaces';

export const initialTaskState: TaskState = {
  loading: false,
  loaded: false,
  taskMap: new Map(),
};
