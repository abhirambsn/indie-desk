import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DialogEventArgs } from '@syncfusion/ej2-angular-kanban';
import _ from 'lodash';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';

import { AppState, TicketActions, TicketSelectors, UserSelectors } from '@ui/app/store';

import { TicketCreateComponent } from '../ticket-create/ticket-create.component';
import { Project, SupportTicket, Column } from 'indiedesk-common-lib';

@UntilDestroy()
@Component({
  selector: 'app-ticket-list',
  imports: [
    RouterLink,
    FormsModule,
    Button,
    Dialog,
    TableModule,
    DropdownModule,
    Tag,
    DatePipe,
    TicketCreateComponent,
  ],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent implements OnInit, OnChanges {
  @Input() selectedProject!: Project | null;

  tickets: SupportTicket[] = [];
  tempTickets: SupportTicket[] = _.cloneDeep(this.tickets);

  newTicket: SupportTicket = {} as SupportTicket;
  createDialogOpen = false;

  supportUsers: any[] = [];

  columns!: Column[];

  @ViewChild('ticketTable') ticketTable: Table | undefined;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  readonly ticketStatuses = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  readonly ticketPriorities = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Critical', value: 'CRITICAL' },
  ];

  ngOnInit(): void {
    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'title', header: 'Title' },
      { field: 'assignee', header: 'Assignee' },
      { field: 'status', header: 'Status' },
      { field: 'priority', header: 'Priority' },
      { field: 'createdAt', header: 'Created At' },
      { field: 'updatedAt', header: 'Updated At' },
      { field: 'project', header: 'Project' },
      { field: 'client', header: 'Client' },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProject']?.currentValue) {
      if (this.selectedProject) {
        this.store$
          .select(UserSelectors.getUsers(this.selectedProject.id))
          .pipe(untilDestroyed(this))
          .subscribe((users) => {
            if (users) {
              this.supportUsers = users.map((user) => ({
                label: `${user.first_name} ${user.last_name} (${user.username})`,
                value: user,
              }));
            }
            console.log('Support users', this.supportUsers);
          });

        this.store$
          .select(TicketSelectors.getTickets(this.selectedProject.id))
          .pipe(untilDestroyed(this))
          .subscribe((tickets) => {
            if (tickets) {
              console.log('Setting tickets', tickets);
              this.tickets = tickets;
              this.tempTickets = _.cloneDeep(this.tickets);
              this.cdr.detectChanges();
            }
          });
      }
    }
  }

  clear(table: Table) {
    table.clear();
  }

  getTicketLink(ticket: SupportTicket) {
    return `/tickets/${ticket.id}`;
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
    this.newTicket.project = this.selectedProject?.id as string;
    this.store$.dispatch(
      TicketActions.saveTicket({
        payload: {
          projectId: this.selectedProject?.id,
          ticket: this.newTicket,
        },
      }),
    );
    this.closeDialog();
  }

  openEditDialog(ticket: SupportTicket) {
    this.newTicket = _.cloneDeep(ticket);
    this.createDialogOpen = true;
  }

  viewTicket(ticketId: string) {
    return ['/tickets', this.selectedProject?.id, ticketId];
  }

  getTicketPriorityBadge(priority: string) {
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

  getTicketStatusBadge(status: string) {
    switch (status) {
      case 'OPEN':
        return 'info';
      case 'IN_PROGRESS':
        return 'warn';
      case 'DONE':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }
}
