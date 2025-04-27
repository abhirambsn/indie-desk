import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-ticket-create',
  imports: [IftaLabel, InputText, ReactiveFormsModule, FormsModule, Textarea, Select],
  templateUrl: './ticket-create.component.html',
})
export class TicketCreateComponent {
  @Input() project!: Project;
  @Input() users: User[] = [];
  @Input() ticket: SupportTicket = {} as SupportTicket;

  readonly ticketStatuses = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  readonly ticketPriorities = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Critical', value: 'CRITICAL' },
  ];
}
