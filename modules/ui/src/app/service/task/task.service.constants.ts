const getTaskBaseURL = (projectId: string) => `/api/v1/${projectId}/task`;
const getTaskURL = (projectId: string, taskId: string) => `/api/v1/${projectId}/task/${taskId}`;
const getTaskCommentUrl = (projectId: string, taskId: string) => `${getTaskURL(projectId, taskId)}/comment`;

export const TaskServiceConstants = {
  getTaskBaseURL,
  getTaskURL,
  getTaskCommentUrl
};
