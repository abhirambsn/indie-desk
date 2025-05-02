import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateComponent } from './user-create.component';
import { Project, User } from 'indiedesk-common-lib';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default user object', () => {
    expect(component.user).toEqual({} as User);
  });

  it('should have predefined user roles', () => {
    expect(component.userRoles).toEqual([
      { label: 'Admin', value: 'ADMIN' },
      { label: 'Support', value: 'SUPPORT' },
    ]);
  });

  it('should accept project input', () => {
    const mockProject: Project = { id: '1', name: 'Test Project' } as Project;
    component.project = mockProject;
    fixture.detectChanges();
    expect(component.project).toBe(mockProject);
  });

  it('should accept user input', () => {
    const mockUser: User = { id: '1', name: 'Test User' } as unknown as User;
    component.user = mockUser;
    fixture.detectChanges();
    expect(component.user).toBe(mockUser);
  });
});
