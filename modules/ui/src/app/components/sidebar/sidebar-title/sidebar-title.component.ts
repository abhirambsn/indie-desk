import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-title',
  imports: [],
  templateUrl: './sidebar-title.component.html',
  styleUrl: './sidebar-title.component.scss'
})
export class SidebarTitleComponent {
  @Output() collapseButtonClick = new EventEmitter();
}
