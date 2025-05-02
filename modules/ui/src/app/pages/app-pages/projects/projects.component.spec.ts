import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { ProjectsComponent } from './projects.component';
import { AppState, ClientActions, ClientSelectors, ProjectActions, ProjectSelectors } from '@ui/app/store';
import { of } from 'rxjs';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let mockStore: MockStore<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [ProjectsComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    mockStore = TestBed.inject(MockStore) as MockStore<AppState>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should dispatch loadProjects on ngOnInit', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(ProjectActions.loadProjects());
  });

  it('should update projects and call detectChanges when selectProjects emits', () => {
    const mockProjects = [{ id: 1, name: 'Test Project' }];
    const selectSpy = spyOn(mockStore, 'select').and.returnValue(of(mockProjects));
    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');

    component.ngOnInit();

    expect(selectSpy).toHaveBeenCalledWith(ProjectSelectors.selectProjects);
    expect(component.projects).toEqual(mockProjects as any[]);
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should update loading and call detectChanges when selectProjectsLoading emits', () => {
    const mockLoading = true;
    const selectSpy = spyOn(mockStore, 'select').and.returnValue(of(mockLoading));

    component.ngOnInit();

    expect(selectSpy).toHaveBeenCalledWith(ProjectSelectors.selectProjectsLoading);
    expect(component.loading).toBe(mockLoading);
  });

  it('should update clients and call detectChanges when selectClients emits', () => {
    const mockClients = [{ id: 1, name: 'Test Client' }];
    const selectSpy = spyOn(mockStore, 'select').and.returnValue(of(mockClients));
    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');

    component.ngOnInit();

    expect(selectSpy).toHaveBeenCalledWith(ClientSelectors.selectClients);
    expect(component.clients).toEqual(mockClients as any[]);
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should dispatch loadClients if clientLoaded is false', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    const selectSpy = spyOn(mockStore, 'select').and.returnValue(of(false));

    component.ngOnInit();

    expect(selectSpy).toHaveBeenCalledWith(ClientSelectors.selectClientLoaded);
    expect(dispatchSpy).toHaveBeenCalledWith(ClientActions.loadClients());
  });

  it('should toggle projectModalOpen on onProjectModalOpenToggle', () => {
    component.onProjectModalOpenToggle({ open: true });
    expect(component.projectModalOpen).toBeTrue();

    component.onProjectModalOpenToggle({ open: false });
    expect(component.projectModalOpen).toBeFalse();
  });

  it('should dispatch saveProject and show success message for new project', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    const messageSpy = spyOn(component['messageService'], 'add');
    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');

    component.onSaveProject({ type: 'new', data: { name: 'New Project' } });

    expect(component.submitting).toBeTrue();
    expect(detectChangesSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      ProjectActions.saveProject({ payload: { data: { name: 'New Project' } } }),
    );
    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Project Created',
      detail: 'Project has been created successfully',
    });
  });

  it('should dispatch updateProject and show success message for existing project', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    const messageSpy = spyOn(component['messageService'], 'add');
    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');

    component.onSaveProject({ type: 'update', data: { name: 'Updated Project' } });

    expect(component.submitting).toBeTrue();
    expect(detectChangesSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      ProjectActions.updateProject({ payload: { data: { name: 'Updated Project' } } }),
    );
    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Project Updated',
      detail: 'Project has been updated successfully',
    });
  });

  it('should dispatch deleteProject and show success message on onDeleteProject', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    const messageSpy = spyOn(component['messageService'], 'add');

    component.onDeleteProject({ data: { id: 1 } });

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProjectActions.deleteProject({ payload: { data: { id: 1 } } }),
    );
    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Project Deleted',
      detail: 'Project has been deleted successfully',
    });
  });
});
