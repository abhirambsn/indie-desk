import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-task-comment-create',
  imports: [Button, FormsModule],
  templateUrl: './task-comment-create.component.html',
})
export class TaskCommentCreateComponent {
  @Input() taskId: any;
  @Input() projectId: any;

  @Output() commentCreateTrigger = new EventEmitter();

  comment = '';
  submitting = false;

  createComment() {
    this.submitting = true;
    this.commentCreateTrigger.emit({
      taskId: this.taskId,
      comment: this.comment,
      projectId: this.projectId,
    });
    this.comment = '';
    this.submitting = false;
  }
}
