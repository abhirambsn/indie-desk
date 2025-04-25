import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket-detail-right-panel',
  imports: [],
  templateUrl: './ticket-detail-right-panel.component.html',
})
export class TicketDetailRightPanelComponent {
  @Input() ticket: SupportTicket = {} as SupportTicket;
}   
