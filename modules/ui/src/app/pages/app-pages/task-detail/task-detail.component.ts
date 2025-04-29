import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TaskService } from '@ui/app/service/task/task.service';
import { AppState, AuthSelectors, TaskActions, UserActions, UserSelectors } from '@ui/app/store';
import { Task } from 'indiedesk-common-lib';
import { MessageService } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'app-task-detail',
  standalone: false,
  providers: [MessageService],
  templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService,
    private readonly store$: Store<AppState>,
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  taskId: string | null = null;
  projectId: string | null = null;

  taskData: Task = {} as Task;
  users: any[] = [];
  comments: any[] = [];

  commentCreateVisible = false;

  access_token = '';
  currentUser: any = null;

  selectedStatus: any = '';
  selectedPriority: any = '';
  selectedAssignee: any = '';

  taskEdited = false;

  readonly taskStatuses = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
  ];

  readonly taskPriorities = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
  ];

  toggleCommentCreate() {
    this.commentCreateVisible = !this.commentCreateVisible;
    this.cdr.detectChanges();
  }

  getPriorityBadgeType(priority: string) {
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

  getStatusBadgeType(status: string) {
    switch (status) {
      case 'OPEN':
        return 'info';
      case 'IN_PROGRESS':
        return 'warn';
      case 'DONE':
        return 'success';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'OPEN':
        return 'Open';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return status;
    }
  }

  getPriorityLabel(priority: string) {
    switch (priority) {
      case 'HIGH':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
        return 'Low';
      default:
        return priority;
    }
  }

  createComment(event: any) {
    const taskId = event.taskId;
    const projectId = event.projectId;
    const commentText = event.comment;

    if (!this.access_token) {
      console.error('[ERROR] Access token is not available');
      return;
    }

    const commentPayload = {
      user: this.currentUser.username,
      comment: commentText,
    };

    this.service.addCommentToTask(projectId, taskId, this.access_token, commentPayload).subscribe({
      next: (response) => {
        console.log('[DEBUG] Comment created successfully: ', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Comment created successfully',
        });
        this.toggleCommentCreate();
        this.getTaskDetails(this.taskId!, this.projectId!);
      },
      error: (error) => {
        console.error('[ERROR] Error creating comment: ', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error creating comment',
        });
      },
    });
  }

  private getTaskDetails(taskId: string, projectId: string) {
    this.store$
      .select(AuthSelectors.selectTokens)
      .pipe(untilDestroyed(this))
      .subscribe((tokens) => {
        if (tokens) {
          this.access_token = tokens.access_token;
        }
      });

    this.service.getTaskById(projectId, taskId, this.access_token).subscribe({
      next: (task) => {
        this.taskData = task;
        this.selectedStatus = task.status;
        this.selectedPriority = task.priority;
        console.log('[DEBUG] Task data: ', this.taskData);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('[ERROR] Error fetching task details: ', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error fetching task details',
        });
      },
    });

    this.service.getComments(projectId, taskId, this.access_token).subscribe({
      next: (comments) => {
        this.comments = comments;
        console.log('[DEBUG] Comments: ', this.comments);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('[ERROR] Error fetching comments: ', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error fetching comments',
        });
      },
    });
  }

  updateTaskStatus() {
    this.taskData.status = this.selectedStatus.value;
    this.taskEdited = true;
  }

  updateTaskPriority() {
    this.taskData.priority = this.selectedPriority.value;
    console.log('[DEBUG] Task priority updated: ', this.taskData.priority);
    this.taskEdited = true;
  }

  updateTaskAssignee() {
    this.taskData.assignee = this.selectedAssignee;
    this.taskEdited = true;
  }

  updateTask() {
    const updateTaskPayload = { ...this.taskData };
    delete updateTaskPayload.createdAt;
    delete updateTaskPayload.updatedAt;

    if (this.taskData.assignee) {
      updateTaskPayload.assignee = (this.taskData.assignee as any)?.username;
    }

    this.store$.dispatch(
      TaskActions.updateTask({
        payload: {
          projectId: this.projectId!,
          task: updateTaskPayload,
        },
      }),
    );
    this.taskEdited = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Task updated successfully',
    });
  }

  getAssigneeName(assignee: any) {
    let result = '';
    if (!assignee) return '-';
    if (assignee?.first_name) {
      result += assignee.first_name;
    }
    if (assignee?.last_name) {
      result += ` ${assignee.last_name}`;
    }

    if (result === '') {
      result += assignee?.username || assignee;
    }
    return result;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('taskId')!;
      this.projectId = params.get('projectId')!;
      this.store$.dispatch(UserActions.loadUsers({ payload: { projectId: this.projectId! } }));
      console.log('[DEBUG] Setting taskId to: ', this.taskId);
      this.getTaskDetails(this.taskId!, this.projectId!);
      this.store$
        .select(UserSelectors.getUsers(this.projectId))
        .pipe(untilDestroyed(this))
        .subscribe((users) => {
          if (users) {
            this.users = users.map((user) => ({
              label: `${user.first_name} ${user.last_name} (${user.username})`,
              value: user,
            }));
          }
        });
    });
    this.store$
      .select(AuthSelectors.selectUser)
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          console.log('[DEBUG] Current user: ', this.currentUser);
        }
      });
  }
}
