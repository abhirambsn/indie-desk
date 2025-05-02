import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSectionComponent } from './sidebar-section.component';
import { SidebarItem, SidebarSection } from 'indiedesk-common-lib';

describe('SidebarSectionComponent', () => {
  let component: SidebarSectionComponent;
  let fixture: ComponentFixture<SidebarSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should filter section.children based on userRole', () => {
      component.section = {
        children: [
          { id: '1', roles: ['admin'] },
          { id: '2', roles: ['user'] },
        ],
      } as unknown as SidebarSection;
      component.userRole = 'admin';

      component.ngOnChanges({
        userRole: {
          currentValue: 'admin',
          previousValue: '',
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.section.children).toEqual([{ id: '1', roles: ['admin'] }] as SidebarItem[]);
    });

    it('should not filter section.children if userRole is empty', () => {
      component.section = {
        children: [
          { id: '1', roles: ['admin'] },
          { id: '2', roles: ['user'] },
        ],
      } as unknown as SidebarSection;
      component.userRole = '';

      component.ngOnChanges({
        userRole: {
          currentValue: '',
          previousValue: 'admin',
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.section.children).toEqual([
        { id: '1', roles: ['admin'] },
        { id: '2', roles: ['user'] },
      ] as unknown as SidebarItem[]);
    });
  });

  describe('linkClicked', () => {
    it('should emit linkClickedEvent with the correct item_id', () => {
      spyOn(component.linkClickedEvent, 'emit');
      const itemId = '123';

      component.linkClicked(itemId);

      expect(component.linkClickedEvent.emit).toHaveBeenCalledWith(itemId);
    });
  });
});
