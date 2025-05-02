import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailFieldComponent } from './ticket-detail-field.component';

describe('TicketDetailFieldComponent', () => {
  let component: TicketDetailFieldComponent;
  let fixture: ComponentFixture<TicketDetailFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetailFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetailFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit fieldEdited when onFieldChange is called', () => {
    spyOn(component.fieldEdited, 'emit');
    const event = { target: { value: 'new value' } };
    component.onFieldChange(event);
    expect(component.fieldEdited.emit).toHaveBeenCalledWith(event);
  });

  it('should return the correct code value when getCodeValue is called', () => {
    component.options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    component.value = '1';
    expect(component.getCodeValue()).toBe('Option 1');

    component.value = '3';
    expect(component.getCodeValue()).toBe('3');
  });

  it('should return the value when options is empty', () => {
    component.options = [];
    component.value = 'test value';
    expect(component.getCodeValue()).toBe('test value');
  });
});
