import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { AppState } from '@/app/store';
import { CurrencyPipe } from '@/app/pipes/currency.pipe';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectCreateComponent } from '../project-create/project-create.component';

@Component({
  selector: 'app-project-table',
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
    CurrencyPipe,
    DatePipe,
    RouterLink,
    ProjectCreateComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './project-table.component.html',
})
export class ProjectTableComponent implements OnInit {
  @Input() projects: Project[] = [];
  @Input() clients: Client[] = [];
  @Input() loading = false;
  @Input() projectDialogOpen = false;
  @Input() submitting = false;

  @Output() projectDialogOpenClick = new EventEmitter();
  @Output() projectSave = new EventEmitter();
  @Output() projectDataExport = new EventEmitter();
  @Output() projectDataDelete = new EventEmitter();

  columns!: Column[];
  exportColumns!: ExportColumn[];

  currentProject: Project = {} as Project;
  dropdownMenu: MenuItem[] = [];

  @ViewChild('projectTable') projectTable!: Table | undefined;
  @ViewChild('menu') menu!: TieredMenu | undefined;

  searchValue = '';
  selectedProjects!: Project[] | null;

  isNewProject = true;

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

    this.exportColumns = this.columns.map((column) => ({
      title: column.header,
      dataKey: column.field,
    }));
  }

  types = [
    { label: 'New', value: 'NEW' },
    { label: 'Ongoing', value: 'ONGOING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'On Hold', value: 'ON_HOLD' },
    { label: 'Canceled', value: 'CANCELED' },
  ];

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  filterGlobal(event: any, stringVal: string) {
    this.projectTable!.filterGlobal(
      (event.target as HTMLInputElement).value,
      stringVal
    );
  }

  exportCSV() {
    this.projectTable?.exportCSV();
  }

  openNew() {
    this.currentProject = {
      perHourRate: { currency: 'USD', amount: 0 },
    } as Project;
    this.isNewProject = true;
    this.projectDialogOpenClick.emit({ open: true });
  }

  getTypeBadge(type: string) {
    switch (type) {
      case 'NEW':
        return 'warn';
      case 'ONGOING':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'ON_HOLD':
        return 'secondary';
      case 'CANCELED':
        return 'danger';
      default:
        return undefined;
    }
  }

  getProjectRouterLink(project: Project) {
    return `/projects/${project.id}`;
  }

  getClientRouterLink(project: Project) {
    return `/clients/${project.client.id}`;
  }

  closeDialog() {
    this.currentProject = {} as Project;
    this.isNewProject = false;
    this.projectDialogOpenClick.emit({ open: false });
  }

  saveProject() {
    this.projectSave.emit({
      type: this.isNewProject ? 'new' : 'update',
      data: this.currentProject,
    });
    this.closeDialog();
  }

  getModalHeader() {
    return !this.currentProject?.id ? 'New Project' : 'Edit Project';
  }

  openDropdownMenu(event: any, project: Project) {
    this.dropdownMenu = this.getDropdownMenu(project);
    this.menu?.toggle(event);
  }

  editProject(project: Project) {
    this.currentProject = { ...project };
    this.isNewProject = false;
    this.projectDialogOpenClick.emit({ open: true });
  }

  deleteProject(project: Project) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.projectDataDelete.emit({
          type: 'single',
          data: project.id,
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

  private getDropdownMenu(project: Project) {
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editProject(project),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteProject(project),
      },
      {
        separator: true,
      },
      {
        label: 'Open Task Board',
        icon: 'pi pi-link',
        route: `/tasks/${project.id}`,
      },
    ];
  }
}
