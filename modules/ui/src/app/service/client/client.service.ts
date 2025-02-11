import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClientServiceConstants} from './client.service.constants';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private readonly http: HttpClient) { }

  getClients(access_token: string) {
    return this.http.get(ClientServiceConstants.CLIENT_BASE_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
      .pipe(
        map((response: any) => response?.data),
        catchError(error => {
          console.error(error);
          return of([]);
        })
      )
  }
}
