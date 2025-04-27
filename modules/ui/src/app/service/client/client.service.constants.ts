const CLIENT_BASE_URL = '/api/v1/clients';

const getEditClientEndpoint = (id: string) => `${CLIENT_BASE_URL}/${id}`;

export const ClientServiceConstants = {
  CLIENT_BASE_URL,
  getEditClientEndpoint,
};
