import { DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-ticket-comment',
  imports: [DatePipe, NgClass, Tag],
  templateUrl: './ticket-comment.component.html',
})
export class TicketCommentComponent {
  @Input() comment: TicketComment = {} as TicketComment;

  getSeverity(commentType: string) {
    if (commentType === 'internal') return 'warn';
    return 'info';
  }
}
