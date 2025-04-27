import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-kpi-card',
  imports: [Card],
  templateUrl: './kpi-card.component.html',
})
export class KpiCardComponent {
  @Input() title = '';
}
