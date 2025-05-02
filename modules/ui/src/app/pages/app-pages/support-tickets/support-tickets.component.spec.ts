import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { SupportTicketsComponent } from './support-tickets.component';
import {
  AppState,
  ProjectActions,
  ProjectSelectors,
  TicketActions,
  UserActions,
} from '@ui/app/store';
import { Project } from 'indiedesk-common-lib';
import { of } from 'rxjs';

describe('SupportTicketsComponent', () => {
  let component: SupportTicketsComponent;
  let fixture: ComponentFixture<SupportTicketsComponent>;
  let mockStore: MockStore<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [SupportTicketsComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportTicketsComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore) as MockStore<AppState>;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadProjects if projects are not loaded', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    mockStore.overrideSelector(ProjectSelectors.selectProjectsLoaded, false);

    component.ngOnInit();
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(ProjectActions.loadProjects());
  });

  it('should update projects when selectProjects emits', () => {
    const mockProjects = [{ id: 1, name: 'Project 1' }] as any[] as Project[];
    mockStore.overrideSelector(ProjectSelectors.selectProjects, mockProjects);

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.projects).toEqual(mockProjects);
  });

  it('should update selectedProject and dispatch loadTickets and loadUsers when selectCurrentProject emits', () => {
    const mockProject = { id: 1, name: 'Project 1' } as unknown as Project;
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    spyOn(mockStore, 'select').and.returnValue(of(mockProject));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.selectedProject).toEqual(mockProject);
    expect(dispatchSpy).toHaveBeenCalledWith(
      TicketActions.loadTickets({ payload: { projectId: mockProject.id } }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      UserActions.loadUsers({ payload: { projectId: mockProject.id } }),
    );
  });

  it('should dispatch selectProject when onProjectChange is called', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    const mockEvent = { value: { id: 1, name: 'Project 1' } };

    component.onProjectChange(mockEvent);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProjectActions.selectProject({ payload: mockEvent.value }),
    );
  });
});
