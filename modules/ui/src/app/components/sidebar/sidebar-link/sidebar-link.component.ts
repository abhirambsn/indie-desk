import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { SidebarItem } from 'indiedesk-common-lib';

@Component({
  selector: 'app-sidebar-link',
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar-link.component.html',
})
export class SidebarLinkComponent {
  @Input() item: SidebarItem = {} as SidebarItem;
  @Output() sidebarButtonClick = new EventEmitter();
  @Output() linkClick = new EventEmitter();
}
