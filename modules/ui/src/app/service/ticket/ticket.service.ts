import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { TicketServiceConstants } from './ticket.service.constants';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private readonly http: HttpClient) {}

  getTickets(projectId: string, accessToken: string) {
    return this.http
      .get(TicketServiceConstants.getTicketEndpointByProjectId(projectId), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      );
  }

  createTicket(projectId: string, accessToken: string, ticketData: any) {
    return this.http
      .post(TicketServiceConstants.getTicketEndpointByProjectId(projectId), ticketData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      );
  }

  updateTicket(projectId: string, accessToken: string, ticketId: string, ticketData: any) {
    return this.http
      .put(
        `${TicketServiceConstants.getTicketEndpointByProjectId(projectId)}/${ticketId}`,
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      );
  }

  getTicketComments(projectId: string, accessToken: string, ticketId: string) {
    return this.http
      .get(TicketServiceConstants.getTicketCommentsEndpoint(projectId, ticketId), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      );
  }

  createComment(projectId: string, ticketId: string, commentData: any, access_token: string) {
    return this.http
      .patch(TicketServiceConstants.getTicketCommentsEndpoint(projectId, ticketId), commentData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      );
  }
}
