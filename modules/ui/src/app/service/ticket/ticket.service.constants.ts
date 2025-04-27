const TICKET_BASE_URL = '/api/v1/tickets';
const getTicketEndpointByProjectId = (projectId: string) => `${TICKET_BASE_URL}/${projectId}`;
const getTicketCommentsEndpoint = (projectId: string, ticketId: string) =>
  `${getTicketEndpointByProjectId(projectId)}/${ticketId}/comments`;

export const TicketServiceConstants = {
  TICKET_BASE_URL,
  getTicketEndpointByProjectId,
  getTicketCommentsEndpoint,
};
