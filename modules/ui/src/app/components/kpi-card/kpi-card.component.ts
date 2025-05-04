import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Card } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-kpi-card',
  imports: [Card, ChartModule],
  templateUrl: './kpi-card.component.html',
})
export class KpiCardComponent implements OnChanges {
  @Input() title = '';
  @Input() value: any = '';
  @Input() type: 'text' | 'graph' = 'text';

  graphData: any;
  options: any;

  constructor(private readonly cdr: ChangeDetectorRef) {}

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
    // get list of months between lastYearDate and currentDate
    this.graphData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'Sales Trend in last 1 year',
          fill: false,
          yAxisID: 'y',
          tension: 0.4,
          data: this.value,
        },
      ],
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false
    }
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']?.currentValue && changes['type']?.currentValue === 'graph') {
      this.constructGraphData();
    }
  }
}
