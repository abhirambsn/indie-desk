import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { AppState, AuthSelectors, KpiSelectors } from '@ui/app/store';
import { CommonHelper } from '@ui/app/helpers/common.helper';
import { User } from 'indiedesk-common-lib';
import { CurrencyPipe } from '@ui/app/pipes/currency.pipe';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  currentUser: User = {} as User;
  greeting = '';
  currentDateTimeString = new Date();
  kpiMetrics: any = {};
  kpiLoading = true;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly currencyPipe: CurrencyPipe,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.store$
      .select(AuthSelectors.selectUser)
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
        }
      });
    this.greeting = CommonHelper.getGreetingBasedOnTime();
    this.store$
      .select(KpiSelectors.selectKpiMetrics)
      .pipe(untilDestroyed(this))
      .subscribe((kpiMetrics) => {
        if (kpiMetrics) {
          this.kpiMetrics = kpiMetrics;
          this.kpiLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  getFormattedCurrency(value: number): string {
    if (value) {
      return this.currencyPipe.transform({ amount: value, currency: 'INR' }) as string;
    }
    return '';
  }
}
