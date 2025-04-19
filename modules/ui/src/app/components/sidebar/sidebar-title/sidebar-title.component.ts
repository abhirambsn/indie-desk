import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-title',
  imports: [],
  templateUrl: './sidebar-title.component.html',
})
export class SidebarTitleComponent {
  @Output() collapseButtonClick = new EventEmitter();
}
