import { ChangeDetectorRef, Component, Input } from '@angular/core';
import _ from 'lodash';
import { NgClass } from '@angular/common';
import { Button } from 'primeng/button';

import { TicketDetailFieldComponent } from '../ticket-detail-field/ticket-detail-field.component';

import { ticketColumns } from './ticket-detail-left-panel.constants';
import { SupportTicket, TicketFieldColumn } from 'indiedesk-common-lib';

@Component({
  selector: 'app-ticket-detail-left-panel',
  imports: [TicketDetailFieldComponent, NgClass, Button],
  templateUrl: './ticket-detail-left-panel.component.html',
})
export class TicketDetailLeftPanelComponent {
  @Input() ticket: SupportTicket = {} as SupportTicket;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ticketEdited = false;

  readonly ticketColumns = ticketColumns;

  getValue(col: TicketFieldColumn): any {
    let value = _.get(this.ticket, col.id);
    if (col.id === 'assignee' && this.ticket.assignee) {
      value = `${this.ticket.assignee?.first_name} ${this.ticket.assignee?.last_name}`;
    }
    if (value) {
      switch (col.type) {
        case 'date':
          if (value) {
            return new Date(value);
          }
          return '';
        case 'number':
          return value.toString();
        default:
          return value;
      }
    }
    return '';
  }

  onFieldEdit(event: any) {
    console.log('[DEBUG] Field edit event: ', event);
    this.ticketEdited = true;
    this.cdr.detectChanges();
  }

  onSaveClick() {
    console.log('[DEBUG] Saving ticket data: ', this.ticket);
    this.ticketEdited = false;
    this.cdr.detectChanges();
  }
}
