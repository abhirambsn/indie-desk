import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePiAddComponent } from './invoice-pi-add.component';

describe('InvoicePiAddComponent', () => {
  let component: InvoicePiAddComponent;
  let fixture: ComponentFixture<InvoicePiAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePiAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicePiAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
