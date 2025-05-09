const AUTH_BASE_URL = '/api/v1/auth';
const TOKEN_ENDPOINT = AUTH_BASE_URL + '/token';
const USER_CREATE_ENDPOINT = AUTH_BASE_URL + '/';
const USER_DETAILS_ENDPOINT = AUTH_BASE_URL + '/me';

const getProjectUsersEndpoint = (projectId: string) => `${AUTH_BASE_URL}/${projectId}/users`;
const getProjectUsersDeleteEndpoint = (projectId: string, userId: string) =>
  `${AUTH_BASE_URL}/${projectId}/users/${userId}`;

const ACCESS_TOKEN_LS_KEY = 'AUTH_ACCESS_TOKEN';
const REFRESH_TOKEN_LS_KEY = 'AUTH_REFRESH_TOKEN';
const EXPIRES_AT_LS_KEY = 'AUTH_EXPIRES_AT';

export const AuthServiceConstants = {
  AUTH_BASE_URL,
  TOKEN_ENDPOINT,
  USER_CREATE_ENDPOINT,
  ACCESS_TOKEN_LS_KEY,
  REFRESH_TOKEN_LS_KEY,
  EXPIRES_AT_LS_KEY,
  USER_DETAILS_ENDPOINT,
  getProjectUsersEndpoint,
  getProjectUsersDeleteEndpoint,
};
