import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppState, AuthSelectors } from '@ui/app/store';

import { sidebarSections } from '../../store/constants/app.constants';

import { SidebarTitleComponent } from './sidebar-title/sidebar-title.component';
import { SidebarSectionComponent } from './sidebar-section/sidebar-section.component';

@UntilDestroy()
@Component({
  selector: 'app-sidebar',
  imports: [SidebarTitleComponent, NgClass, SidebarSectionComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly store$: Store<AppState>,
  ) {}

  @Input() title = '';
  @Input() sections: SidebarSection[] = [];
  @Input() collapsed = false;

  @Output() sidebarCollapseClick = new EventEmitter();
  protected readonly sidebarSections = sidebarSections;

  displaySidebarSections = sidebarSections;
  userRole = '';

  ngOnInit(): void {
    this.store$
      .select(AuthSelectors.selectUser)
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        if (user) {
          this.userRole = user.role as string;
          this.displaySidebarSections = sidebarSections.filter((section) => {
            return section.roles?.includes(user?.role as string);
          });
          this.cdr.detectChanges();
        }
      });
  }
  linkClicked(item_id: string) {
    this.sections.forEach((section) => {
      section.children.forEach((child) => {
        child.isActive = child.id === item_id;
      });
    });
    this.cdr.detectChanges();
  }
}
