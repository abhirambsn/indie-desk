const TICKET_BASE_URL = '/api/v1/tickets';
const getTicketEndpointByProjectId = (projectId: string) => `${TICKET_BASE_URL}/${projectId}`;

export const TicketServiceConstants = {
  TICKET_BASE_URL,
  getTicketEndpointByProjectId
}
