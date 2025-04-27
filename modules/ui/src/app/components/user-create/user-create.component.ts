import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-user-create',
  imports: [IftaLabel, InputText, ReactiveFormsModule, FormsModule, Select],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent {
  @Input() project!: Project;
  @Input() user: User = {} as User;

  readonly userRoles = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Support', value: 'SUPPORT' },
  ];
}
