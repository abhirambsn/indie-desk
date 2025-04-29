import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-comment',
  imports: [DatePipe],
  templateUrl: './task-comment.component.html',
})
export class TaskCommentComponent {
  @Input() comment: any;
}
