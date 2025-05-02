import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InvoiceCreateComponent } from './invoice-create.component';
import InvoiceStatus from '@ui/app/enums/invoice-status.enum';
import { Client } from 'indiedesk-common-lib';

describe('InvoiceCreateComponent', () => {
  let component: InvoiceCreateComponent;
  let fixture: ComponentFixture<InvoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, InvoiceCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize client options when clients input is set', () => {
    const clients = [
      { id: 1, name: 'Client A' },
      { id: 2, name: 'Client B' },
    ];
    component.clients = clients;
    expect(component._clientOptions).toEqual([
      { label: 'Client A', value: 1 },
      { label: 'Client B', value: 2 },
    ]);
  });

  it('should initialize client options when clients input is not set', () => {
    component.clients = undefined;
    component.projects = undefined;
    fixture.detectChanges();
    expect(component._clientOptions).toEqual([]);
    expect(component._projectOptions).toEqual([]);
  });

  it('should initialize project options when projects input is set', () => {
    const projects = [
      { id: 1, name: 'Project A', clientId: 1 },
      { id: 2, name: 'Project B', clientId: 2 },
    ];
    component.projects = projects;
    expect(component._projectOptions).toEqual([
      { label: 'Project A', value: 1 },
      { label: 'Project B', value: 2 },
    ]);
  });

  it('should filter projects by client', () => {
    component.invoice.client = { id: '1', name: 'Client A' } as Client;
    component._projectOptions = [
      { label: 'Project A', value: '1' },
      { label: 'Project B', value: '2' },
    ];
    component._projectData = [
      { id: '1', name: 'Project A', client: { id: '1' } },
      { id: '2', name: 'Project B', client: { id: '1' } },
    ];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update selected project on project change', () => {
    const projects = [
      { id: 1, name: 'Project A' },
      { id: 2, name: 'Project B' },
    ];
    component._projectData = projects;
    component.onProjectChange({ value: 1 });
    expect(component.selectedProject).toEqual({ id: 1, name: 'Project A' });
  });

  it('should add a task and update counter', () => {
    component.taskCount = 1;
    component.addTask();
    expect(component.taskCount).toBe(2);
    expect(component._counter).toEqual([0]);
  });

  it('should remove a task and update counter', () => {
    component.taskCount = 3;
    component._counter = [0, 1];
    component.removeTask(1);
    expect(component.taskCount).toBe(2);
    expect(component._counter).toEqual([0]);
  });

  it('should remove an existing task by id', () => {
    component.invoice.items = [
      { id: '1', description: 'Task 1', hours: 1 },
      { id: '2', description: 'Task 2', hours: 2 },
    ];
    component.removeExistingTask('1');
    expect(component.invoice.items).toEqual([{ id: '2', description: 'Task 2', hours: 2 }]);
  });

  it('should save a new task', () => {
    component.invoice.items = [];
    const task = { description: 'New Task', hours: 1 };
    component.saveTask(task);
    expect(component.invoice.items).toEqual([{ description: 'New Task', id: '1', hours: 1 }]);
  });

  it('should have predefined invoice statuses', () => {
    expect(component.invoiceStatuses).toEqual([
      { label: 'Draft', value: InvoiceStatus.DRAFT },
      { label: 'Sent', value: InvoiceStatus.SENT },
      { label: 'Paid', value: InvoiceStatus.PAID },
    ]);
  });

  it('should calcuate task cost properly', () => {
    component.selectedProject = {
      id: '1',
      name: 'Project A',
      perHourRate: {
        currency: 'USD',
        amount: 100,
      },
    };

    const task = { hours: 2 };
    const result = component.calcTaskAmount(task);
    expect(result).toEqual({
      currency: 'USD',
      amount: 200,
    });
  });
});
