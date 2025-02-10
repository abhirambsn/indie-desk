import {Component, Input} from '@angular/core';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-kpi-card',
  imports: [
    Card
  ],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  @Input() title = '';
}
