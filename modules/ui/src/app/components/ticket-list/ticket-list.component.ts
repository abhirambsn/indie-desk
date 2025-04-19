import { AppState, TicketActions } from '@/app/store';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DialogEventArgs } from '@syncfusion/ej2-angular-kanban';
import _ from 'lodash';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@UntilDestroy()
@Component({
  selector: 'app-ticket-list',
  imports: [
    RouterLink,
    FormsModule,
    Button,
    Dialog
  ],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent {
  @Input() selectedProject!: Project | null;

  tickets: SupportTicket[] = [];
  tempTickets: SupportTicket[] = _.cloneDeep(this.tickets);

  newTicket: SupportTicket = {} as SupportTicket;
  createDialogOpen = false;

  constructor(private readonly store$: Store<AppState>) {}

  getTicketLink(ticket: SupportTicket) {
    return `/tickets/${ticket.id}`;
  }

  getBadgeType(priority: string) {
    switch (priority) {
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warn';
      case 'LOW':
        return 'secondary';
      default:
        return 'info';
    }
  }

  onDialogOpen(args: DialogEventArgs) {
    args.cancel = true;
  }

  closeDialog() {
    this.createDialogOpen = false;
    this.newTicket = {} as SupportTicket;
  }

  openCreateDialog() {
    this.createDialogOpen = true;
  }

  saveTicket() {
    console.log('[DEBUG] Saving ticket', this.newTicket);
    this.newTicket.project = { id: this.selectedProject?.id } as Project;
    this.store$.dispatch(
      TicketActions.saveTicket({
        payload: {
          projectId: this.selectedProject?.id,
          ticket: this.newTicket,
        },
      })
    );
    this.closeDialog();
  }
}
