import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set label', () => {
    component.label = 'Test';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('p-button');
    expect(button.textContent).toEqual('Test');
  });

  it('should emit clickEvent when onButtonClick is called', () => {
    spyOn(component.clickEvent, 'emit');
    component.onButtonClick();
    expect(component.clickEvent.emit).toHaveBeenCalled();
  });

  it('should return "w-full" when fullWidth is true', () => {
    component.fullWidth = true;
    expect(component.getClass()).toEqual('w-full');
  });

  it('should return an empty string when fullWidth is false', () => {
    component.fullWidth = false;
    expect(component.getClass()).toEqual('');
  });

  it('should render the button with the correct label', () => {
    component.label = 'Click Me';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('p-button');
    expect(button.textContent).toContain('Click Me');
  });

  it('should bind the type input to the button element', () => {
    component.type = 'submit';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('p-button button');
    expect(button.getAttribute('type')).toEqual('submit');
  });

  it('should apply the fullWidth class when fullWidth is true', () => {
    component.fullWidth = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('p-button');
    expect(button.classList).toContain('w-full');
  });

  it('should not apply the fullWidth class when fullWidth is false', () => {
    component.fullWidth = false;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('p-button');
    expect(button.classList).not.toContain('w-full');
  });
});
