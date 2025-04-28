import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { ClientServiceConstants } from './client.service.constants';
import { Client } from 'indiedesk-common-lib';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private readonly http: HttpClient) {}

  getClients(access_token: string) {
    return this.http
      .get(ClientServiceConstants.CLIENT_BASE_URL, {
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

  createClient(clientData: Client, access_token: string) {
    return this.http
      .post(ClientServiceConstants.CLIENT_BASE_URL, clientData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of({});
        }),
      );
  }

  updateClient(clientData: Client, access_token: string) {
    const id = clientData.id;
    const payload: any = { ...clientData };
    delete payload.id;

    const endpoint = ClientServiceConstants.getEditClientEndpoint(id);

    return this.http
      .patch(
        endpoint,
        { data: payload },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of({});
        }),
      );
  }

  deleteClient(id: string, access_token: string) {
    const endpoint = ClientServiceConstants.getEditClientEndpoint(id);
    return this.http
      .delete(endpoint, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of({});
        }),
      );
  }
}
