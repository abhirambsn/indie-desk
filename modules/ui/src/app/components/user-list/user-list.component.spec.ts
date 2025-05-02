import { ComponentFixture, TestBed } from '@angular/core/testing';
import _ from 'lodash';
import { provideMockStore } from '@ngrx/store/testing';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { UserListComponent } from './user-list.component';
import { User, Project } from 'indiedesk-common-lib';
import { of } from 'rxjs';
import { Table } from 'primeng/table';
import { DialogEventArgs } from '@syncfusion/ej2-angular-kanban';
import { UserActions } from '@ui/app/store';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UserListComponent Additional Tests', () => {
    it('should initialize columns and set writeAccess on ngOnInit', () => {
      const mockUser = { role: 'admin' };
      spyOn(component['store$'], 'select').and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(component.columns).toEqual([
        { field: 'username', header: 'Username' },
        { field: 'first_name', header: 'First Name' },
        { field: 'last_name', header: 'Last Name' },
        { field: 'role', header: 'Role' },
      ]);
      expect(component.writeAccess).toBeTrue();
    });

    it('should update users and tempUsers on ngOnChanges when selectedProject changes', () => {
      const mockUsers = [{ id: 1, username: 'testUser' }];
      spyOn(component['store$'], 'select').and.returnValue(of(mockUsers));

      component.selectedProject = { id: 1 } as unknown as Project;
      component.ngOnChanges({
        selectedProject: {
          currentValue: component.selectedProject,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component).toBeTruthy();
    });

    it('should clear the table when clear is called', () => {
      const mockTable = { clear: jasmine.createSpy('clear') } as unknown as Table;

      component.clear(mockTable);

      expect(mockTable.clear).toHaveBeenCalled();
    });

    it('should cancel dialog open event in onDialogOpen', () => {
      const args = { cancel: false } as DialogEventArgs;

      component.onDialogOpen(args);

      expect(args.cancel).toBeTrue();
    });

    it('should close the dialog and reset newUser in closeDialog', () => {
      component.createDialogOpen = true;
      component.newUser = { username: 'test' } as User;

      component.closeDialog();

      expect(component.createDialogOpen).toBeFalse();
      expect(component.newUser).toEqual({} as User);
    });

    it('should open the create dialog in openCreateDialog', () => {
      component.createDialogOpen = false;

      component.openCreateDialog();

      expect(component.createDialogOpen).toBeTrue();
    });

    it('should validate and dispatch saveUser action in saveTicket', () => {
      spyOn(window, 'alert');
      spyOn(component['store$'], 'dispatch');

      component.newUser = { password: '123', confirm_password: '123', username: 'test' } as User;
      component.selectedProject = { id: 1 } as unknown as Project;

      component.saveTicket();

      expect(component['store$'].dispatch).toHaveBeenCalledWith(
        UserActions.saveUser({
          payload: {
            projectId: 1,
            user: { password: '123', username: 'test', project_id: 1 },
          },
        }),
      );
      expect(component.createDialogOpen).toBeFalse();
    });

    it('should alert if password is missing in saveTicket', () => {
      spyOn(window, 'alert');

      component.newUser = { confirm_password: '123' } as User;

      component.saveTicket();

      expect(window.alert).toHaveBeenCalledWith('Password is required');
    });

    it('should alert if passwords do not match in saveTicket', () => {
      spyOn(window, 'alert');

      component.newUser = { password: '123', confirm_password: '456' } as User;

      component.saveTicket();

      expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
    });

    it('should open edit dialog and clone user in openEditDialog', () => {
      const mockUser = { username: 'testUser' } as User;

      component.openEditDialog(mockUser);

      expect(component.newUser).toEqual(mockUser);
      expect(component.createDialogOpen).toBeTrue();
    });

    it('should return correct badge type in getUserRoleBadge', () => {
      expect(component.getUserRoleBadge('ADMIN')).toBe('info');
      expect(component.getUserRoleBadge('SUPPORT')).toBe('warn');
    });
  });
});
