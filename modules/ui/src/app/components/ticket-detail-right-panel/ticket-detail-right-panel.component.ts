import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TicketCommentCreateComponent } from "../ticket-comment-create/ticket-comment-create.component";
import { TicketCommentComponent } from "../ticket-comment/ticket-comment.component";
import { TicketService } from '@/app/service/ticket/ticket.service';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from '@/app/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Button } from 'primeng/button';

@UntilDestroy()
@Component({
  selector: 'app-ticket-detail-right-panel',
  imports: [TicketCommentCreateComponent, TicketCommentComponent, Button],
  templateUrl: './ticket-detail-right-panel.component.html',
})
export class TicketDetailRightPanelComponent {
  @Input() ticket: SupportTicket = {} as SupportTicket;
  @Output() refetchComments = new EventEmitter();

  access_token = '';
  createVisible = false;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly service: TicketService
  ) {}

  onOpenCreate() {
    this.createVisible = !this.createVisible;
  }

  createComment(comment: TicketComment) {
    console.log('[DEBUG] Creating comment: ', comment);
    this.store$.select(AuthSelectors.selectTokens).pipe(untilDestroyed(this))
      .subscribe((tokens) => {
        if (tokens) {
          this.access_token = tokens.access_token;
        }
      })
    this.service.createComment(this.ticket.project.id, this.ticket.id, comment, this.access_token).subscribe({
      next: (response) => {
        console.log('[DEBUG] Comment created successfully: ', response);
        this.ticket.comments.push(response);
        this.refetchComments.emit();
        this.createVisible = false;
      },
      error: (error) => {
        console.error('[ERROR] Error creating comment: ', error);
      }
    });
  }
}   
