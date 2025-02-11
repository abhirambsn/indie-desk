import {Component, Input, ViewChild} from '@angular/core';
import {Client} from '../../types';
import {Table, TableModule} from 'primeng/table';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {Tag} from 'primeng/tag';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-client-table',
  imports: [
    TableModule,
    IconField,
    InputIcon,
    InputText,
    Tag,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss'
})
export class ClientTableComponent {
  @Input() clients: Client[] = [];
  @Input() loading = false;

  @ViewChild('clientTable') clientTable: Table | undefined;

  searchValue = '';

  types = [
    {label: 'Organization', value: 'ORGANIZATION'},
    {label: 'Individual', value: 'INDIVIDUAL'}
  ]

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  getTypeBadge(type: string) {
    switch(type) {
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

}
