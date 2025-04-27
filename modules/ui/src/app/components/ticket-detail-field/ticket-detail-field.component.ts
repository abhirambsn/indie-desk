import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ticket-detail-field',
  imports: [DatePipe],
  templateUrl: './ticket-detail-field.component.html',
})
export class TicketDetailFieldComponent {
  @Input() fieldId = '';
  @Input() fieldName = '';
  @Input() value: any = '';
  @Input() isRequired = false;
  @Input() readonly = true;
  @Input() isVisible = true;
  @Input() type = 'text';
  @Input() options: { label: string; value: string }[] = [];

  @Output() fieldEdited = new EventEmitter();

  getCodeValue() {
    if (this.options.length > 0) {
      const option = this.options.find((option) => option.value === this.value);
      return option ? option.label : this.value;
    }
    return this.value;
  }

  onFieldChange(event: any) {
    this.fieldEdited.emit(event);
  }
}
