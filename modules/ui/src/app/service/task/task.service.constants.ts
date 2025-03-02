const getTaskBaseURL = (projectId: string) => `/api/v1/${projectId}/task`;
const getTaskURL = (projectId: string, taskId: string) => `/api/v1/${projectId}/task/${taskId}`;

export const TaskServiceConstants = {
    getTaskBaseURL,
    getTaskURL
}