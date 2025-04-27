import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

import ProjectStatus from '@ui/app/enums/project-status.enum';

@Component({
  selector: 'app-project-create',
  imports: [IftaLabel, InputText, ReactiveFormsModule, FormsModule, Textarea, Select],
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent {
  @Input() project: Project = {} as Project;

  _clientOptions: any[] = [];

  @Input()
  set clients(val: Client[]) {
    if (val) {
      this._clientOptions = val.map((client: Client) => {
        return {
          label: client.name,
          value: {
            id: client.id,
          },
        };
      });
    } else {
      this._clientOptions = [];
    }
  }

  readonly projectStatuses = [
    { label: 'New', value: ProjectStatus.New },
    { label: 'Ongoing', value: ProjectStatus.Ongoing },
    { label: 'Completed', value: ProjectStatus.Completed },
    { label: 'Cancelled', value: ProjectStatus.Canceled },
    { label: 'On Hold', value: ProjectStatus.OnHold },
  ];

  readonly currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'Great Britain Pound (GBP)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'INR', label: 'Indian Rupee (INR)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'CNY', label: 'Chinese Yuan (CNY)' },
    { value: 'SGD', label: 'Singapore Dollar (SGD)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' },
    { value: 'MYR', label: 'Malaysian Ringgit (MYR)' },
    { value: 'NZD', label: 'New Zealand Dollar (NZD)' },
    { value: 'THB', label: 'Thai Baht (THB)' },
  ];
}
