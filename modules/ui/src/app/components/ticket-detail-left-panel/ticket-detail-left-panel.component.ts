import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';
import { NgClass } from '@angular/common';
import { Button } from 'primeng/button';

import { TicketDetailFieldComponent } from '../ticket-detail-field/ticket-detail-field.component';

import { ticketColumns } from './ticket-detail-left-panel.constants';
import { SupportTicket, TicketFieldColumn, User } from 'indiedesk-common-lib';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from '@ui/app/store';

@Component({
  selector: 'app-ticket-detail-left-panel',
  imports: [TicketDetailFieldComponent, NgClass, Button],
  templateUrl: './ticket-detail-left-panel.component.html',
})
export class TicketDetailLeftPanelComponent implements OnInit {
  @Input() ticket: SupportTicket = {} as SupportTicket;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef

  ) {}

  ticketEdited = false;
  user: User | null = null;

  readonly ticketColumns = ticketColumns;

  ngOnInit(): void {
      this.store$.select(AuthSelectors.selectUser)
      .subscribe((user) => {
        if (user) {
          this.user = user;
          this.cdr.detectChanges();
        }
      })
  }

  getValue(col: TicketFieldColumn): any {
    let value = _.get(this.ticket, col.id);
    const user = this.ticket.assignee as User;
    if (col.id === 'assignee' && this.ticket.assignee) {
      value = `${user?.first_name} ${user?.last_name}`;
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

  selfAssignTicket() {
    console.log('[DEBUG] Self-assigning ticket: ', this.ticket);
    const updatedTicket = {
      ...this.ticket,
      assignee: this.user?.username
    }
    console.log('[DEBUG] Updated ticket: ', updatedTicket);
    this.cdr.detectChanges();
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
