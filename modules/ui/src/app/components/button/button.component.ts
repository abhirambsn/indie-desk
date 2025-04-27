import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() label = '';
  @Input() type = '';
  @Input() fullWidth = false;
  @Output() clickEvent = new EventEmitter();

  onButtonClick() {
    this.clickEvent.emit();
  }

  getClass() {
    return this.fullWidth ? 'w-full' : '';
  }
}
