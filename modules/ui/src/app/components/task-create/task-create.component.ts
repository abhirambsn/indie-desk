import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Project, User, Task } from 'indiedesk-common-lib';

@Component({
  selector: 'app-task-create',
  imports: [IftaLabel, InputText, ReactiveFormsModule, FormsModule, Textarea, Select],
  templateUrl: './task-create.component.html',
})
export class TaskCreateComponent {
  @Input() project!: Project;
  @Input() users: User[] = [];
  @Input() task: Task = {} as Task;

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
}
