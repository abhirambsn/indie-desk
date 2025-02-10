import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SidebarItem} from '../../../types';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-sidebar-link',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './sidebar-link.component.html',
  styleUrl: './sidebar-link.component.scss'
})
export class SidebarLinkComponent {
  @Input() item: SidebarItem = {} as SidebarItem;
  @Output() sidebarButtonClick = new EventEmitter();
  @Output() linkClick = new EventEmitter();
}
