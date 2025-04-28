import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { AppState, AuthSelectors, TicketActions, TicketSelectors } from '@ui/app/store';
import { TicketService } from '@ui/app/service/ticket/ticket.service';
import { SupportTicket, TicketComment } from 'indiedesk-common-lib';

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

  private access_token = '';

  constructor(
    private route: ActivatedRoute,
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly service: TicketService,
  ) {}

  getTicketCommments() {
    this.store$
      .select(AuthSelectors.selectTokens)
      .pipe(untilDestroyed(this))
      .subscribe((tokens) => {
        if (tokens) {
          this.access_token = tokens.access_token;
        }
      });
    this.service
      .getTicketComments(this.projectId!, this.access_token, this.ticketId!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (ticketComments) => {
          this.ticketData.comments = ticketComments.sort(
            (a: TicketComment, b: TicketComment) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('[ERROR] Error fetching ticket comments: ', error);
          this.ticketData.comments = [];
        },
      });
  }

  getTicketAttachments() {
    this.ticketData = {
      ...this.ticketData,
      attachments: [],
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.ticketId = params.get('ticketId')!;
      this.projectId = params.get('projectId')!;
      console.log('[DEBUG] Setting ticketId to: ', this.ticketId);
      console.log('[DEBUG] Setting projectId to: ', this.projectId);

      this.store$
        .select(TicketSelectors.getTicketById(this.projectId!, this.ticketId!))
        .pipe(untilDestroyed(this))
        .subscribe((ticket) => {
          if (ticket) {
            this.ticketData = ticket;
            this.getTicketCommments();
            this.getTicketAttachments();
          } else {
            this.store$.dispatch(
              TicketActions.loadTickets({ payload: { projectId: this.projectId! } }),
            );
          }
        });
    });
  }
}
