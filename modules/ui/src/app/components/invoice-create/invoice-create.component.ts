import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Client, Invoice, InvoiceItem } from 'indiedesk-common-lib';

import InvoiceStatus from '@ui/app/enums/invoice-status.enum';

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

  _projectData: any[] = [];

  taskCount = 1;
  _counter = [] as number[];

  selectedProject: any = null;

  @Input()
  set clients(val: any) {
    if (val) {
      this._clientOptions = val.map((client: any) => {
        return {
          label: client.name,
          value: client.id,
        };
      });
    } else {
      this._clientOptions = [];
    }
  }

  @Input()
  set projects(val: any) {
    if (val) {
      this._projectData = val;
      this._projectOptions = val.map((project: any) => {
        return {
          label: project.name,
          value: project.id,
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
      (project) => project.value.clientId === (this.invoice?.client as Client)?.id,
    );
  }

  onProjectChange(event: any) {
    const project = this._projectData.find((project) => project.id === event.value);
    this.selectedProject = project;
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
    this.invoice.items = this.invoice.items.filter((task: any) => task.id !== id);
  }

  saveTask(task: any) {
    this.invoice.items.push({
      ...task,
      id: `${this.invoice.items.length + 1}`,
    });
  }
} 
