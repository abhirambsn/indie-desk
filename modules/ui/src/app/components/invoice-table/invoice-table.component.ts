import { AppState, InvoiceActions } from '@/app/store';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUpload } from 'primeng/fileupload';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { TieredMenu } from 'primeng/tieredmenu';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { InvoiceCreateComponent } from '../invoice-create/invoice-create.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-table',
  imports: [
    TableModule,
    IconField,
    InputIcon,
    InputText,
    Tag,
    FormsModule,
    DropdownModule,
    Toolbar,
    Button,
    FileUpload,
    Dialog,
    Toast,
    ConfirmDialog,
    TieredMenu,
    InvoiceCreateComponent,
    DatePipe
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './invoice-table.component.html',
})
export class InvoiceTableComponent implements OnInit {
  @Input() invoices: Invoice[] = [];
  @Input() clients: Client[] = [];
  @Input() projects: Project[] = [];
  @Input() loading = false;
  @Input() invoiceDialogOpen = false;
  @Input() submitting = false;

  @Output() invoiceDialogOpenClick = new EventEmitter();
  @Output() invoiceSave = new EventEmitter();
  @Output() invoiceDataExport = new EventEmitter();
  @Output() invoiceDataDelete = new EventEmitter();

  columns!: Column[];
  exportColumns!: ExportColumn[];

  currentInvoice: Invoice = {} as Invoice;
  dropdownMenu: MenuItem[] = [];

  @ViewChild('invoiceTable') invoiceTable: Table | undefined;
  @ViewChild('menu') menu: TieredMenu | undefined;

  searchValue = '';
  selectedInvoices!: Invoice[] | null;

  isNewInvoice = true;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly store$: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
    ];

    this.exportColumns = this.columns.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  types = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Void', value: 'VOID' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Sent', value: 'SENT' },
    { label: 'Overdue', value: 'OVERDUE' },
  ];

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  filterGlobal(event: any, stringVal: string) {
    this.invoiceTable!.filterGlobal(
      (event.target as HTMLInputElement).value,
      stringVal
    );
  }

  openNew() {
    console.log('[DEBUG] Opening new invoice', this.clients);
    this.currentInvoice = {
      items: [] as InvoiceItem[],
    } as Invoice;
    this.isNewInvoice = true;
    this.invoiceDialogOpenClick.emit({ open: true });
  }

  deleteSelectedInvoices() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected invoices?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.invoiceDataDelete.emit({
          type: 'multi',
          data: this.selectedInvoices?.map((invoice) => invoice.id),
        });
        this.selectedInvoices = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Invoices Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteInvoice(invoice: Invoice) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this invoice?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.invoiceDataDelete.emit({
          type: 'single',
          data: invoice.id,
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Invoice Deleted',
          life: 3000,
        });
      },
    });
  }

  exportCSV() {
    this.invoiceTable?.exportCSV();
  }

  closeDialog() {
    this.currentInvoice = {} as Invoice;
    this.isNewInvoice = false;
    this.invoiceDialogOpenClick.emit({ open: false });
  }

  saveInvoice() {
    this.currentInvoice.date = new Date();
    this.invoiceSave.emit({
      data: this.currentInvoice,
      type: this.isNewInvoice ? 'new' : 'edit',
    });
    this.closeDialog();
  }

  editInvoice(invoice: Invoice) {
    this.currentInvoice = { ...invoice };
    this.isNewInvoice = false;
    this.invoiceDialogOpenClick.emit({ open: true });
  }

  openDropdownMenu(event: any, invoice: Invoice) {
    this.dropdownMenu = this.getDropdownMenu(invoice);
    this.menu?.toggle(event);
  }

  getModalHeader() {
    return !this.currentInvoice?.id ? 'New Invoice' : 'Edit Invoice';
  }

  downloadInoice(invoice: Invoice) {
    console.log('[DEBUG] Downloading invoice', invoice);
    this.store$.dispatch(InvoiceActions.downloadInvoice({ id: invoice.id }));
  }

  private getDropdownMenu(invoice: Invoice): MenuItem[] {
    const actions = this.getActionByStatus(invoice);
    return [
      ...actions,
      {
        separator: true,
      },
      {
        label: 'Download Invoice',
        icon: 'pi pi-download',
        command: () => this.downloadInoice(invoice),
      },
    ];
  }

  private sendInvoice(invoice: Invoice) {
    console.log('[DEBUG] Sending invoice', invoice);
    this.currentInvoice = { ...invoice };
    this.currentInvoice.status = 'SENT';
    this.invoiceSave.emit({
      data: this.currentInvoice,
      type: 'edit',
    });
    this.currentInvoice = {} as Invoice;
  }

  private voidInvoice(invoice: Invoice) {
    console.log('[DEBUG] Voiding invoice', invoice);
    this.currentInvoice = { ...invoice };
    this.currentInvoice.status = 'VOID';
    this.invoiceSave.emit({
      data: this.currentInvoice,
      type: 'edit',
    });
    this.currentInvoice = {} as Invoice;
  }

  private getActionByStatus(invoice: Invoice): MenuItem[] {
    const editInvoice = {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.editInvoice(invoice),
    };

    const deleteInvoice = {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.deleteInvoice(invoice),
    };

    const sendInvoice = {
      label: 'Send',
      icon: 'pi pi-send',
      command: () => this.sendInvoice(invoice),
    };
    const voidInvoice = {
      label: 'Mark as Void',
      icon: 'pi pi-ban',
      command: () => this.voidInvoice(invoice),
    };

    switch (invoice.status) {
      case 'DRAFT':
        return [editInvoice, deleteInvoice, sendInvoice];
      case 'SENT':
        return [voidInvoice];
      default:
        return [];
    }
  }

  getTypeBadge(type: string) {
    switch (type) {
      case 'DRAFT':
        return 'warn';
      case 'SENT':
        return 'info';
      case 'PAID':
        return 'success';
      case 'VOID':
      case 'OVERDUE':
        return 'danger';
      default:
        return undefined;
    }
  }
}
