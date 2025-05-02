import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCreateComponent } from './project-create.component';
import { Client, Project } from 'indiedesk-common-lib';
import ProjectStatus from '@ui/app/enums/project-status.enum';

describe('ProjectCreateComponent', () => {
  let component: ProjectCreateComponent;
  let fixture: ComponentFixture<ProjectCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCreateComponent);
    component = fixture.componentInstance;
    component.project = {
      perHourRate: {
        amount: 0,
        currency: 'USD',
      },
    } as Project;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set empty array if clients are undefined', () => {
    component.clients = undefined as any;
    expect(component['_clientOptions']).toEqual([]);
    expect(component).toBeTruthy();
  });

  it('should set client options when clients input is provided', () => {
    const mockClients: Client[] = [
      { id: '1', name: 'Client A' },
      { id: '1', name: 'Client B' },
    ] as Client[];
    component.clients = mockClients;

    expect(component['_clientOptions']).toEqual([
      { label: 'Client A', value: '1' },
      { label: 'Client B', value: '1' },
    ]);
  });

  it('should clear client options when clients input is null', () => {
    component.clients = [];

    expect(component['_clientOptions']).toEqual([]);
  });

  it('should have predefined project statuses', () => {
    expect(component.projectStatuses).toEqual([
      { label: 'New', value: ProjectStatus.New },
      { label: 'Ongoing', value: ProjectStatus.Ongoing },
      { label: 'Completed', value: ProjectStatus.Completed },
      { label: 'Cancelled', value: ProjectStatus.Canceled },
      { label: 'On Hold', value: ProjectStatus.OnHold },
    ]);
  });

  it('should have predefined currencies', () => {
    expect(component.currencies).toEqual([
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
    ]);
  });
});
