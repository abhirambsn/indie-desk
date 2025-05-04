import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { AppState, KpiSelectors } from '@ui/app/store';

@UntilDestroy()
@Component({
  selector: 'app-sales',
  standalone: false,
  templateUrl: './sales.component.html',
})
export class SalesComponent implements OnInit {
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly store$: Store<AppState>,
  ) {}

  salesData: any;
  salesGraphConfig: any;
  options: any;

  private getMonthsBetween(startDate: Date, endDate: Date): string[] {
    const months: string[] = [];
    const start = new Date(startDate.getFullYear(), startDate.getMonth());
    const end = new Date(endDate.getFullYear(), endDate.getMonth());
    start.setDate(1);
    end.setDate(1);
    const current = new Date(start);
    while (current <= end) {
      months.push(current.toLocaleString('default', { month: 'long', year: 'numeric' }));
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  }

  constructGraphData() {
    const currentDate = new Date();
    const lastYearDate = new Date();
    lastYearDate.setFullYear(currentDate.getFullYear() - 1);
    lastYearDate.setMonth(currentDate.getMonth() - 1);
    const monthLabels = this.getMonthsBetween(lastYearDate, currentDate);
    this.salesGraphConfig = {
      labels: monthLabels,
      datasets: [
        {
          label: 'Sales Trend in last 1 year',
          fill: false,
          yAxisID: 'y',
          tension: 0.4,
          data: this.salesData,
        },
      ],
    };

    this.options = {
      responsive: true,
    };

    console.log('Sales Graph Config:', this.salesGraphConfig);
    console.log('Sales Graph Options:', this.options);
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.store$
      .select(KpiSelectors.selectKpiMetrics)
      .pipe(untilDestroyed(this))
      .subscribe((kpiMetrics) => {
        if (kpiMetrics) {
          this.salesData = kpiMetrics?.salesTrend?.sales;
          this.constructGraphData();
          this.cdr.detectChanges();
        }
      });
  }
}
