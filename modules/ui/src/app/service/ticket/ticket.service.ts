import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketServiceConstants } from './ticket.service.constants';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }

  getTickets(projectId: string, accessToken: string) {
    return this.http.get(TicketServiceConstants.getTicketEndpointByProjectId(projectId), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  createTicket(projectId: string, accessToken: string, ticketData: any) {
    return this.http.post(TicketServiceConstants.getTicketEndpointByProjectId(projectId), ticketData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  updateTicket(projectId: string, accessToken: string, ticketId: string, ticketData: any) {
    return this.http.put(`${TicketServiceConstants.getTicketEndpointByProjectId(projectId)}/${ticketId}`, ticketData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
}
