import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { TicketComment } from 'indiedesk-common-lib';

@Component({
  selector: 'app-ticket-comment-create',
  imports: [TabsModule, FormsModule, Button],
  templateUrl: './ticket-comment-create.component.html',
  styleUrl: './ticket-comment-create.component.scss',
})
export class TicketCommentCreateComponent implements OnInit {
  @Input() ticketId: string | null = null;
  @Input() projectId: string | null = null;

  ticketCommentModel: TicketComment = {} as TicketComment;

  @Output() createCommentTrigger = new EventEmitter();
  @Output() refreshComments = new EventEmitter();

  ngOnInit(): void {
    this.ticketCommentModel = {
      type: 'internal',
      text: '',
    } as TicketComment;
  }

  onTypeChange(event: any) {
    console.log('[DEBUG] Type changed: ', event);
    this.ticketCommentModel.type = event;
  }

  postComment() {
    this.createCommentTrigger.emit(this.ticketCommentModel);
    this.ticketCommentModel = {
      type: 'internal',
      text: '',
    } as TicketComment;
  }
}
