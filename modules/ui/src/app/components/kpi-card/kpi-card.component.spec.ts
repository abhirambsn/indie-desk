import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCardComponent } from './kpi-card.component';
import { SimpleChanges } from '@angular/core';

describe('KpiCardComponent', () => {
  let component: KpiCardComponent;
  let fixture: ComponentFixture<KpiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Graph type KPI card', () => {
    beforeEach(() => {
      component.type = 'graph';
      fixture.detectChanges();
    });

    it('should construct graph data correctly', () => {
      component.value = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300];
      component.constructGraphData();
      expect(component.graphData.labels.length).toBe(14);
      expect(component.graphData.datasets[0].data.length).toBe(13);
    });

    it('should get months between two dates correctly', () => {
      const startDate = new Date('2022-01-01');
      const endDate = new Date('2023-01-01');
      const months = component['getMonthsBetween'](startDate, endDate);
      expect(months.length).toBe(13);
      expect(months[0]).toBe('January 2022');
      expect(months[12]).toBe('January 2023');
    });

    it('should handle empty value correctly', () => {
      component.value = [];
      component.constructGraphData();
      expect(component.graphData.labels.length).toBe(14);
      expect(component.graphData.datasets[0].data.length).toBe(0);
    });
  });

  it('should handle text type correctly', () => {
    component.type = 'text';
    component.value = 'Test Value';
    fixture.detectChanges();
    const cardElement: HTMLElement = fixture.nativeElement.querySelector('p-card');
    expect(cardElement).toBeTruthy();
    expect(cardElement.textContent).toContain('Test Value');
  });

  it('should call function if condition met on changes', () => {
    const spy = spyOn(component, 'constructGraphData').and.returnValue(undefined);
    const changes = {
      value: {
        currentValue: [100, 200, 300],
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
      type: {
        currentValue: 'graph',
        previousValue: 'text',
        firstChange: true,
        isFirstChange: () => true,
      },
    } as SimpleChanges

    component.ngOnChanges(changes);
    expect(spy).toHaveBeenCalled();
  })
});
