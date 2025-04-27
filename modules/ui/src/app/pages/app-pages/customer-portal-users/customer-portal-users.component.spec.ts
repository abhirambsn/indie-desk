import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPortalUsersComponent } from './customer-portal-users.component';

describe('CustomerPortalUsersComponent', () => {
  let component: CustomerPortalUsersComponent;
  let fixture: ComponentFixture<CustomerPortalUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPortalUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerPortalUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
