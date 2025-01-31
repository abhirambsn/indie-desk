import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label = '';
  @Output() click = new EventEmitter();

  onButtonClick() {
    this.click.emit();
  }
}
