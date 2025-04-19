import InvoiceStatus from '@/app/enums/invoice-status.enum';
import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-invoice-create',
  imports: [
    IftaLabel,
    InputText,
    ReactiveFormsModule,
    FormsModule,
    Textarea,
    ButtonModule,
    Select,
    NgTemplateOutlet,
  ],
  templateUrl: './invoice-create.component.html',
})
export class InvoiceCreateComponent {
  @Input() invoice: Invoice = {
    description: '',
    items: [] as InvoiceItem[],
  } as Invoice;

  _clientOptions: any[] = [];
  _projectOptions: any[] = [];

  taskCount = 1;
  _counter = [] as number[];

  @Input()
  set clients(val: any) {
    if (val) {
      this._clientOptions = val.map((client: any) => {
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

  @Input()
  set projects(val: any) {
    if (val) {
      this._projectOptions = val.map((project: any) => {
        return {
          label: project.name,
          value: {
            perHourRate: project.perHourRate,
            id: project.id,
            clientId: project.client.id
          },
        };
      });
    } else {
      this._projectOptions = [];
    }
  }

  get projectsByClient() {
    if (!this.invoice.client) {
      return [];
    }
    return this._projectOptions.filter(
      (project) => project.value.clientId === this.invoice?.client?.id
    );
  }

  invoiceStatuses = [
    { label: 'Draft', value: InvoiceStatus.DRAFT },
    { label: 'Sent', value: InvoiceStatus.SENT },
    { label: 'Paid', value: InvoiceStatus.PAID },
  ];

  addTask() {
    this.taskCount++;
    this._counter = [...Array(this.taskCount - 1).keys()];
  }

  removeTask(index: number) {
    console.log('removing task', index);
    this.taskCount--;
    this._counter = [...Array(this.taskCount - 1).keys()];
  }

  removeExistingTask(id: string) {
    this.invoice.items = this.invoice.items.filter((task) => task.id !== id);
  }

  saveTask(task: any) {
    this.invoice.items.push({
      ...task,
      id: `${this.invoice.items.length + 1}`,
    });
  }
}
