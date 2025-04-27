const PROJECT_BASE_URL = '/api/v1/projects';
const getEditProjectEndpoint = (invoiceId: string) => `${PROJECT_BASE_URL}/${invoiceId}`;

export const ProjectServiceConstants = {
  PROJECT_BASE_URL,
  getEditProjectEndpoint,
};
