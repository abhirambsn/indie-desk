import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCommentCreateComponent } from './task-comment-create.component';

describe('TaskCommentCreateComponent', () => {
  let component: TaskCommentCreateComponent;
  let fixture: ComponentFixture<TaskCommentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCommentCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCommentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit commentCreateTrigger with correct payload when createComment is called', () => {
    const emitSpy = spyOn(component.commentCreateTrigger, 'emit');
    component.taskId = 1;
    component.projectId = 2;
    component.comment = 'Test comment';

    component.createComment();

    expect(emitSpy).toHaveBeenCalledWith({
      taskId: 1,
      comment: 'Test comment',
      projectId: 2,
    });
  });

  it('should reset comment and submitting after createComment is called', () => {
    component.comment = 'Test comment';
    component.submitting = false;

    component.createComment();

    expect(component.comment).toBe('');
    expect(component.submitting).toBe(false);
  });

  it('should set submitting to true when createComment is called', () => {
    component.submitting = false;

    component.createComment();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept taskId and projectId as inputs', () => {
    component.taskId = 123;
    component.projectId = 456;

    expect(component.taskId).toBe(123);
    expect(component.projectId).toBe(456);
  });
});
