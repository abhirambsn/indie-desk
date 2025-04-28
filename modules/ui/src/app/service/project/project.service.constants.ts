const PROJECT_BASE_URL = '/api/v1/projects';
const getEditProjectEndpoint = (invoiceId: string) => `${PROJECT_BASE_URL}/${invoiceId}`;
const getProjectByIdEndpoint = (projectId: string) => `${PROJECT_BASE_URL}/${projectId}`;

export const ProjectServiceConstants = {
  PROJECT_BASE_URL,
  getEditProjectEndpoint,
  getProjectByIdEndpoint,
};
