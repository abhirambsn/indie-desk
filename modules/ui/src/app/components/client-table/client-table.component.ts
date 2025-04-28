import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { Dialog } from 'primeng/dialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TieredMenu } from 'primeng/tieredmenu';
import { Client, Column, ExportColumn } from 'indiedesk-common-lib';

import { ClientCreateComponent } from '../client-create/client-create.component';

@Component({
  selector: 'app-client-table',
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
    ClientCreateComponent,
    Toast,
    ConfirmDialog,
    TieredMenu,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss',
})
export class ClientTableComponent implements OnInit {
  @Input() clients: Client[] = [];
  @Input() loading = false;
  @Input() clientDialogOpen = false;
  @Input() submitting = false;

  @Output() clientDialogOpenClick = new EventEmitter();
  @Output() clientSave = new EventEmitter();
  @Output() clientDataExport = new EventEmitter();
  @Output() clientDataDelete = new EventEmitter();

  columns!: Column[];
  exportColumns!: ExportColumn[];

  currentClient: Client = {} as Client;
  dropdownMenu: MenuItem[] = [];

  @ViewChild('clientTable') clientTable: Table | undefined;
  @ViewChild('menu') menu: TieredMenu | undefined;

  searchValue = '';
  selectedClients!: Client[] | null;

  isNewClient = true;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit() {
    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'city', header: 'City' },
      { field: 'state', header: 'State' },
      { field: 'zip', header: 'Zip' },
      { field: 'phone', header: 'Phone' },
      { field: 'email', header: 'Email' },
      { field: 'contact', header: 'Contact' },
      { field: 'type', header: 'Type' },
    ];

    this.exportColumns = this.columns.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  types = [
    { label: 'Organization', value: 'ORGANIZATION' },
    { label: 'Individual', value: 'INDIVIDUAL' },
  ];

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  getTypeBadge(type: string) {
    switch (type) {
      case 'ORGANIZATION':
        return 'success';
      case 'INDIVIDUAL':
        return 'info';
      default:
        return undefined;
    }
  }

  filterGlobal(event: any, stringVal: string) {
    this.clientTable!.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  openNew() {
    this.currentClient = {} as Client;
    this.isNewClient = true;
    this.clientDialogOpenClick.emit({ open: true });
  }

  deleteSelectedClients() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected clients?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientDataDelete.emit({
          type: 'multi',
          data: this.selectedClients?.map((client) => client.id),
        });
        this.selectedClients = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Clients Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteClient(client: Client) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the client ' + client.name + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientDataDelete.emit({ type: 'single', data: client.id });
        this.selectedClients = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Client ' + client.name + ' Deleted',
          life: 3000,
        });
      },
    });
  }

  exportCSV() {
    this.clientTable?.exportCSV();
  }

  closeDialog() {
    this.currentClient = {} as Client;
    this.isNewClient = false;
    this.clientDialogOpenClick.emit({ open: false });
  }

  saveClient() {
    this.clientSave.emit({
      data: this.currentClient,
      type: this.isNewClient ? 'new' : 'edit',
    });
    this.closeDialog();
  }

  editClient(client: Client) {
    this.currentClient = { ...client };
    this.isNewClient = false;
    this.clientDialogOpenClick.emit({ open: true });
  }

  openDropdownMenu(event: any, client: Client) {
    this.dropdownMenu = this.getDropdownMenu(client);
    this.menu?.toggle(event);
  }

  getModalHeader() {
    return this.currentClient?.id ? 'Edit Client' : 'New Client';
  }

  private getDropdownMenu(client: Client): MenuItem[] {
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editClient(client),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteClient(client),
      },
    ];
  }
}
