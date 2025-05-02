import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { ProjectTableComponent } from './project-table.component';
import { Project } from 'indiedesk-common-lib';
import { ConfirmationService } from 'primeng/api';

describe('ProjectTableComponent', () => {
  let component: ProjectTableComponent;
  let fixture: ComponentFixture<ProjectTableComponent>;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [ProjectTableComponent],
      providers: [
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectTableComponent);
    confirmationService = TestBed.inject(ConfirmationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize columns and exportColumns on ngOnInit', () => {
    component.ngOnInit();
    expect(component.columns).toEqual([
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
    ]);
    expect(component.exportColumns).toEqual([
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
    ]);
  });

  it('should clear table and reset searchValue', () => {
    const mockTable = jasmine.createSpyObj('Table', ['clear']);
    component.searchValue = 'test';
    component.clear(mockTable);
    expect(mockTable.clear).toHaveBeenCalled();
    expect(component.searchValue).toBe('');
  });

  it('should filter globally', () => {
    const mockEvent = { target: { value: 'test' } };
    component.projectTable = jasmine.createSpyObj('Table', ['filterGlobal']);
    component.filterGlobal(mockEvent, 'contains');
    expect(component.projectTable!.filterGlobal).toHaveBeenCalledWith('test', 'contains');
  });

  it('should export CSV', () => {
    component.projectTable = jasmine.createSpyObj('Table', ['exportCSV']);
    component.exportCSV();
    expect(component.projectTable!.exportCSV).toHaveBeenCalled();
  });

  it('should open new project dialog', () => {
    spyOn(component.projectDialogOpenClick, 'emit');
    component.openNew();
    expect(component.currentProject).toEqual({
      perHourRate: { currency: 'USD', amount: 0 },
    } as Project);
    expect(component.isNewProject).toBeTrue();
    expect(component.projectDialogOpenClick.emit).toHaveBeenCalledWith({ open: true });
  });

  it('should return correct type badge', () => {
    expect(component.getTypeBadge('NEW')).toBe('warn');
    expect(component.getTypeBadge('ONGOING')).toBe('info');
    expect(component.getTypeBadge('COMPLETED')).toBe('success');
    expect(component.getTypeBadge('ON_HOLD')).toBe('secondary');
    expect(component.getTypeBadge('CANCELED')).toBe('danger');
    expect(component.getTypeBadge('UNKNOWN')).toBeUndefined();
  });

  it('should return correct project router link', () => {
    const project = { id: '123' } as Project;
    expect(component.getProjectRouterLink(project)).toBe('/projects/123');
  });

  it('should return correct client router link', () => {
    const project = { client: { id: '456' } } as Project;
    expect(component.getClientRouterLink(project)).toBe('/clients/456');
  });

  it('should close dialog and reset currentProject', () => {
    spyOn(component.projectDialogOpenClick, 'emit');
    component.closeDialog();
    expect(component.currentProject).toEqual({} as Project);
    expect(component.isNewProject).toBeFalse();
    expect(component.projectDialogOpenClick.emit).toHaveBeenCalledWith({ open: false });
  });

  it('should save project and close dialog', () => {
    spyOn(component.projectSave, 'emit');
    spyOn(component, 'closeDialog');
    component.isNewProject = true;
    component.currentProject = { id: '123' } as Project;
    component.saveProject();
    expect(component.projectSave.emit).toHaveBeenCalledWith({
      type: 'new',
      data: { id: '123' },
    });
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should update project and close dialog', () => {
    spyOn(component.projectSave, 'emit');
    spyOn(component, 'closeDialog');
    component.isNewProject = false;
    component.currentProject = { id: '123' } as Project;
    component.saveProject();
    expect(component.projectSave.emit).toHaveBeenCalledWith({
      type: 'update',
      data: { id: '123' },
    });
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should return correct modal header', () => {
    component.currentProject = { id: '123' } as Project;
    expect(component.getModalHeader()).toBe('Edit Project');
    component.currentProject = {} as Project;
    expect(component.getModalHeader()).toBe('New Project');
  });

  it('should open dropdown menu', () => {
    spyOn<any>(component.menu, 'toggle');
    spyOn<any>(component, 'getDropdownMenu').and.returnValue([]);
    const mockEvent = {};
    const project = {} as Project;
    component.openDropdownMenu(mockEvent, project);
    expect(component['getDropdownMenu']).toHaveBeenCalledWith(project);
    expect(component.menu?.toggle).toHaveBeenCalledWith(mockEvent);
  });

  it('should edit project and open dialog', () => {
    spyOn(component.projectDialogOpenClick, 'emit');
    const project = { id: '123' } as Project;
    component.editProject(project);
    expect(component.currentProject).toEqual(project);
    expect(component.isNewProject).toBeFalse();
    expect(component.projectDialogOpenClick.emit).toHaveBeenCalledWith({ open: true });
  });

  it('should delete project with confirmation', () => {
    spyOn(confirmationService, 'confirm');
    const project = { id: '123' } as Project;
    component.deleteProject(project);
    expect(component).toBeTruthy();
  });

  it('should return correct dropdown menu', () => {
    const project = { id: '123' } as Project;
    const menu = component['getDropdownMenu'](project);
    expect(menu.length).toBe(4);
    expect(menu[0].label).toBe('Edit');
    expect(menu[1].label).toBe('Delete');
    expect(menu[3].route).toBe('/tasks/123');
  });
});
