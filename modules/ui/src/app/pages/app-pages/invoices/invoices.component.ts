import {
  AppState,
  ClientActions,
  ClientSelectors,
  InvoiceActions,
  InvoiceSelectors,
} from '@/app/store';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'app-invoices',
  providers: [MessageService],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesComponent implements OnInit {
  title = 'IndieDesk | Invoices';

  invoices: Invoice[] = [];
  clients: Client[] = [];
  invoiceModalOpen = false;
  submitting = false;
  loading = false;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.store$.dispatch(InvoiceActions.loadInvoices());
    this.store$
      .select(InvoiceSelectors.selectInvoices)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        if (state) {
          this.invoices = state;
          this.cdr.detectChanges();
        }
      });
    this.store$
      .select(ClientSelectors.selectClients)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        if (state) {
          this.clients = state;
          this.cdr.detectChanges();
        }
      });
    this.store$
      .select(ClientSelectors.selectClientLoaded)
      .pipe(untilDestroyed(this))
      .subscribe((clientLoaded) => {
        if (!clientLoaded) {
          this.store$.dispatch(ClientActions.loadClients());
        }
      });
    this.store$
      .select(InvoiceSelectors.selectInvoiceLoading)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.loading = state;
        this.cdr.detectChanges();
      });
  }

  onInvoiceModalOpenToggle(event: any) {
    this.invoiceModalOpen = event?.open;
  }

  onSaveInvoice(event: any) {
    console.log('[DEBUG] saving invoice', event);
    this.submitting = true;
    this.cdr.detectChanges();
    if (event?.type === 'new') {
      this.store$.dispatch(
        InvoiceActions.saveInvoice({
          payload: { data: event?.data },
        })
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Invoice Created',
        detail: 'Invoice has been created successfully',
      });
    } else if (event?.type === 'edit') {
      this.store$.dispatch(
        InvoiceActions.updateInvoice({
          payload: { data: event?.data },
        })
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Invoice Updated',
        detail: 'Invoice has been updated successfully',
      });
    }
  }

  onDeleteInvoice(event: any) {
    console.log('[DEBUG] deleting invoice', event);
  }
}
