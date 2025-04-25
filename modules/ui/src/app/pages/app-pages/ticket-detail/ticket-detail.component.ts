import { TicketService } from '@/app/service/ticket/ticket.service';
import { AppState, TicketActions, TicketSelectors } from '@/app/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent implements OnInit {
  ticketId: string | null = null;
  projectId: string | null = null;

  ticketData: SupportTicket = {} as SupportTicket;

  constructor(
    private route: ActivatedRoute,
    private readonly store$: Store<AppState>,
    private readonly service: TicketService
  ) {}

  getTicketCommments() {
    this.ticketData.comments = [];
  }

  getTicketAttachments() {
    this.ticketData.attachments = [];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.ticketId = params.get('ticketId')!;
      this.projectId = params.get('projectId')!;
      console.log('[DEBUG] Setting ticketId to: ', this.ticketId);
      console.log('[DEBUG] Setting projectId to: ', this.projectId);

      this.store$.select(TicketSelectors.getTicketById(this.projectId!, this.ticketId!))
        .pipe(untilDestroyed(this))
        .subscribe((ticket) => {
          if (ticket) {
            this.ticketData = ticket;
            this.getTicketCommments();
            this.getTicketAttachments();
            console.log('[DEBUG] Ticket data: ', this.ticketData);
          } else {
            this.store$.dispatch(TicketActions.loadTickets({payload: {projectId: this.projectId!}}));
          }
        });
    });
  }
}
