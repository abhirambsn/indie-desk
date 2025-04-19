import { AppState, TaskActions, TaskSelectors } from '@/app/store';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import {
  CardSettingsModel,
  DialogEventArgs,
  KanbanComponent,
  KanbanModule,
} from '@syncfusion/ej2-angular-kanban';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { TaskCreateComponent } from "../task-create/task-create.component";
import _ from 'lodash';

@UntilDestroy()
@Component({
  selector: 'app-task-list',
  imports: [KanbanModule, RouterLink, Badge, FormsModule, Button, Dialog, TaskCreateComponent],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnChanges {
  @Input() selectedProject!: Project | null;
  @ViewChild('kanbanComponent') kanbanComponent!: KanbanComponent;

  tasks: Task[] = [];
  tempTasks: Task[] = _.cloneDeep(this.tasks);

  newTask: Task = {} as Task;
  createDialogOpen = false;

  cardSettings: CardSettingsModel = {
    contentField: 'description',
    headerField: 'id',
    selectionType: 'Single',
  };

  constructor(private readonly store$: Store<AppState>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProject']?.currentValue) {
      if (this.selectedProject) {
        this.store$
          .select(TaskSelectors.getTasks(this.selectedProject.id))
          .pipe(untilDestroyed(this))
          .subscribe((tasks) => {
            if (tasks) {
              console.log('Setting tasks', tasks);
              this.tasks = tasks;
              this.tempTasks = _.cloneDeep(this.tasks);
              this.kanbanComponent.refresh();
              this.kanbanComponent.hideSpinner();
            }
          });
      }
    }
  }

  getTaskLink(task: Task) {
    return `/tasks/${task.id}`;
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
    this.newTask = {} as Task;
  }

  saveTask() {
    console.log('[DEBUG] Saving task', this.newTask);
    this.newTask.project = {id: this.selectedProject?.id} as Project;
    this.store$.dispatch(TaskActions.saveTask({ payload: { projectId: this.selectedProject?.id, task: this.newTask } }));
    this.closeDialog();
  }

  openCreateDialog() {
    this.createDialogOpen = true;
  }

  updateCard(event: any) {
    console.log('[DEBUG] Updating card', event);
    this.kanbanComponent.showSpinner();
    this.store$.dispatch(TaskActions.updateTask({ payload: { projectId: this.selectedProject?.id, task: event.data[0] } }));
  }
}
