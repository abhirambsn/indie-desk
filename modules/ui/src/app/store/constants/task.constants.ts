import { TaskState } from "../interfaces";

export const initialTaskState: TaskState = {
    loading: false,
    loaded: false,
    taskMap: new Map()
};