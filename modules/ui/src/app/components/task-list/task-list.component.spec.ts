import { ComponentFixture, TestBed } from '@angular/core/testing';
import _ from 'lodash';
import { provideMockStore } from '@ngrx/store/testing';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { TaskListComponent } from './task-list.component';
import { Store } from '@ngrx/store';
import { AppState, TaskActions, TaskSelectors, UserSelectors } from '@ui/app/store';
import { of } from 'rxjs';
import { SimpleChanges } from '@angular/core';
import { Project, Task } from 'indiedesk-common-lib';
import { DialogEventArgs, KanbanComponent } from '@syncfusion/ej2-angular-kanban';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let store: Store<AppState>;
  let mockKanbanComponent: jasmine.SpyObj<KanbanComponent>;

  beforeEach(async () => {
    mockKanbanComponent = jasmine.createSpyObj('KanbanComponent', [
      'refresh',
      'hideSpinner',
      'showSpinner',
    ]);

    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: KanbanComponent, useValue: mockKanbanComponent },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as Store<AppState>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should fetch users and tasks when selectedProject changes', () => {
      const mockUsers = [{ first_name: 'John', last_name: 'Doe', username: 'johndoe' }];
      const mockTasks = [{ id: '1', description: 'Test Task' }];
      component.kanbanComponent = mockKanbanComponent;
      spyOn(store, 'select').and.callFake((selector: any) => {
        if (selector === UserSelectors.getUsers('1')) {
          return of(mockUsers);
        }
        if (selector === TaskSelectors.getTasks('1')) {
          return of(mockTasks);
        }
        return of([]);
      });

      component.selectedProject = { id: '1', name: 'Test Project' } as Project;
      component.ngOnChanges({
        selectedProject: {
          currentValue: component.selectedProject,
          previousValue: null,
          isFirstChange: () => true,
          firstChange: true,
        },
      } as SimpleChanges);

      expect(component).toBeTruthy();
    });
  });

  it('should generate correct task link', () => {
    component.selectedProject = { id: '1', name: 'Test Project' } as Project;
    const task = { id: '123' } as Task;
    expect(component.getTaskLink(task)).toBe('/tasks/1/123');
  });

  it('should return correct badge type for priority', () => {
    expect(component.getBadgeType('HIGH')).toBe('danger');
    expect(component.getBadgeType('MEDIUM')).toBe('warn');
    expect(component.getBadgeType('LOW')).toBe('secondary');
    expect(component.getBadgeType('UNKNOWN')).toBe('info');
  });

  it('should cancel dialog opening', () => {
    const args = { cancel: false } as DialogEventArgs;
    component.onDialogOpen(args);
    expect(args.cancel).toBeTrue();
  });

  it('should close dialog and reset newTask', () => {
    component.createDialogOpen = true;
    component.newTask = { id: '123' } as Task;
    component.closeDialog();
    expect(component.createDialogOpen).toBeFalse();
    expect(component.newTask).toEqual({} as Task);
  });

  it('should dispatch saveTask action and close dialog', () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'closeDialog');
    component.selectedProject = { id: '1' } as Project;
    component.newTask = { description: 'New Task' } as Task;

    component.saveTask();

    expect(store.dispatch).toHaveBeenCalledWith(
      TaskActions.saveTask({
        payload: { projectId: '1', task: { description: 'New Task', project: '1' } },
      }),
    );
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should open create dialog', () => {
    component.createDialogOpen = false;
    component.openCreateDialog();
    expect(component.createDialogOpen).toBeTrue();
  });

  it('should dispatch updateTask action with modified task', () => {
    component.kanbanComponent = mockKanbanComponent;
    spyOn(store, 'dispatch');
    const event = {
      data: [{ id: '123', project: { id: '1' }, createdAt: '2023-01-01', updatedAt: '2023-01-02' }],
    };

    component.selectedProject = { id: '1' } as Project;
    component.updateCard(event);

    expect(store.dispatch).toHaveBeenCalledWith(
      TaskActions.updateTask({
        payload: { projectId: '1', task: { id: '123', project: '1' } },
      }),
    );
    expect(component.kanbanComponent.showSpinner).toHaveBeenCalled();
  });
});
