import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DialogEventArgs } from '@syncfusion/ej2-angular-kanban';
import _ from 'lodash';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';

import { AppState, AuthSelectors, UserActions, UserSelectors } from '@ui/app/store';

import { UserCreateComponent } from '../user-create/user-create.component';

@UntilDestroy()
@Component({
  selector: 'app-user-list',
  imports: [
    FormsModule,
    Button,
    Dialog,
    TableModule,
    DropdownModule,
    Tag,
    DatePipe,
    UserCreateComponent,
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit, OnChanges {
  @Input() selectedProject!: Project | null;

  users: User[] = [];
  tempUsers: User[] = _.cloneDeep(this.users);
  newUser: User = {} as User;

  createDialogOpen = false;
  columns!: Column[];

  writeAccess = false;

  @ViewChild('userTable') userTable: Table | undefined;

  constructor(private readonly store$: Store<AppState>) {}

  readonly userRoles = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Support', value: 'SUPPORT' },
  ];

  ngOnInit(): void {
    this.columns = [
      { field: 'username', header: 'Username' },
      { field: 'first_name', header: 'First Name' },
      { field: 'last_name', header: 'Last Name' },
      { field: 'role', header: 'Role' },
    ];

    this.store$
      .select(AuthSelectors.selectUser)
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        if (user) {
          this.writeAccess = user.role === 'admin';
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProject']?.currentValue) {
      if (this.selectedProject) {
        this.store$
          .select(UserSelectors.getUsers(this.selectedProject.id))
          .pipe(untilDestroyed(this))
          .subscribe((users) => {
            if (users) {
              console.log('users', users);
              this.users = users;
              this.tempUsers = _.cloneDeep(users);
            }
          });
      }
    }
  }

  clear(table: Table) {
    table.clear();
  }

  onDialogOpen(args: DialogEventArgs) {
    args.cancel = true;
  }

  closeDialog() {
    this.createDialogOpen = false;
    this.newUser = {} as User;
  }

  openCreateDialog() {
    this.createDialogOpen = true;
  }

  saveTicket() {
    console.log('[DEBUG] Saving user', this.newUser);
    if (!this.newUser.password?.length) {
      alert('Password is required');
      return;
    }
    if (this.newUser.password !== this.newUser.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    delete this.newUser.confirm_password;
    this.newUser.project_id = this.selectedProject?.id;
    this.store$.dispatch(
      UserActions.saveUser({
        payload: {
          projectId: this.selectedProject?.id,
          user: this.newUser,
        },
      }),
    );
    this.closeDialog();
  }

  openEditDialog(user: User) {
    this.newUser = _.cloneDeep(user);
    this.createDialogOpen = true;
  }

  getUserRoleBadge(role: string) {
    if (role === 'ADMIN') return 'info';
    else return 'warn';
  }
}
