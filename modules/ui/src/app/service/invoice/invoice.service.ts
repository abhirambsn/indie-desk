import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceServiceConstants } from './invoice.service.constants';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private readonly http: HttpClient) {}

  getInvoices(access_token: string) {
    return this.http
      .get(InvoiceServiceConstants.INVOICE_BASE_URL, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of([]);
        })
      );
  }

  downloadInvoice(id: string, access_token: string) {
    return this.http
      .get(InvoiceServiceConstants.getInvoiceDownloadUrl(id), {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        responseType: 'blob',
      })
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          console.error(error);
          return of({});
        })
      );
  }

  createInvoice(invoice: Invoice, access_token: string) {
    const payload: any = { ...invoice };
    delete payload?.project?.perHourRate;
    delete payload?.clientId;

    return this.http
      .post(InvoiceServiceConstants.INVOICE_BASE_URL, payload, {
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
        })
      );
  }

  updateInvoice(invoice: Invoice, access_token: string) {
    const id = invoice?.id;
    const payload: any = { ...invoice };
    delete payload.id;
    delete payload?.project;
    delete payload?.clientId;

    const endpoint = InvoiceServiceConstants.getEditInvoiceEndpoint(id);

    return this.http
      .patch(
        endpoint,
        { data: payload },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of({});
        })
      );
  }
}
