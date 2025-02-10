import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUsersComponent } from './support-users.component';

describe('SupportUsersComponent', () => {
  let component: SupportUsersComponent;
  let fixture: ComponentFixture<SupportUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
