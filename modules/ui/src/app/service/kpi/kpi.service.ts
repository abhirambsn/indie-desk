import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KpiServiceConstants } from './kpi.service.constants';
import { forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  constructor(private readonly http: HttpClient) {}

  private getProjectCount(access_tokentoken: string, owner: string) {
    return this.http.get(KpiServiceConstants.getProjectCountUrl(owner), {
      headers: { Authorization: `Bearer ${access_tokentoken}` },
    });
  }

  private getSupportTicketCount(access_tokentoken: string, owner: string) {
    return this.http.get(KpiServiceConstants.getSupportTicketCountUrl(owner), {
      headers: { Authorization: `Bearer ${access_tokentoken}` },
    });
  }

  private getRevenue(access_tokentoken: string, owner: string, year: number, month: number) {
    return this.http.post(
      KpiServiceConstants.getRevenueUrl(owner),
      { year, month },
      {
        headers: { Authorization: `Bearer ${access_tokentoken}` },
      },
    );
  }

  private getClientsInLastMonth(access_tokentoken: string, owner: string, days = 30) {
    return this.http.post(
      KpiServiceConstants.getClientsInLastMonthUrl(owner),
      { days },
      {
        headers: { Authorization: `Bearer ${access_tokentoken}` },
      },
    );
  }

  private getSalesTrend(access_tokentoken: string, owner: string, start_date = new Date(), end_date = new Date()) {
    const start_year = start_date.getFullYear();
    const start_month = start_date.getMonth();
    const end_year = end_date.getFullYear();
    const end_month = end_date.getMonth();

    return this.http.post(KpiServiceConstants.getSalesTrend(owner), {
      start_year,
      start_month,
      end_year,
      end_month,
    }, {
      headers: { Authorization: `Bearer ${access_tokentoken}` },
    });
  }

  getKpiMetrics(access_token: string, owner: string) {
    const currentDate = new Date();
    const lastYearDate = new Date();
    lastYearDate.setFullYear(currentDate.getFullYear() - 1);
    lastYearDate.setMonth(currentDate.getMonth() - 1);
    lastYearDate.setDate(1);
    return forkJoin([
      this.getProjectCount(access_token, owner),
      this.getSupportTicketCount(access_token, owner),
      this.getRevenue(access_token, owner, currentDate.getFullYear(), currentDate.getMonth()),
      this.getClientsInLastMonth(access_token, owner),
      this.getSalesTrend(access_token, owner, lastYearDate, currentDate),
    ]).pipe(
      map(([projectCount, supportTicketCount, revenue, clientsLastMonth, salesTrend]) => ({
        projectCount,
        supportTicketCount,
        revenue,
        clientsLastMonth,
        salesTrend,
      })),
    );
  }
}
