import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MessageService } from 'primeng/api';

import { AppState } from '@ui/app/store/interfaces';
import { ClientActions } from '@ui/app/store/actions';
import { ClientSelectors } from '@ui/app/store/selectors';
import { Client } from 'indiedesk-common-lib';

@UntilDestroy()
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  providers: [MessageService],
  standalone: false,
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  clientModalOpen = false;
  clientsLoading = true;
  submitting = false;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit() {
    this.store$.dispatch(ClientActions.loadClients());
    this.store$
      .select(ClientSelectors.selectClients)
      .pipe(untilDestroyed(this))
      .subscribe((clients: any) => {
        if (clients) {
          this.clients = clients;
          this.cdr.detectChanges();
        }
      });
    this.store$
      .select(ClientSelectors.selectClientLoading)
      .pipe(untilDestroyed(this))
      .subscribe((loading: any) => {
        this.clientsLoading = loading;
        this.cdr.detectChanges();
      });
  }

  onClientModalOpenToggle(event: any) {
    this.clientModalOpen = event?.open;
  }

  onSaveClient(event: any) {
    this.submitting = true;
    this.cdr.detectChanges();
    if (event?.type === 'new') {
      this.store$.dispatch(ClientActions.saveClient({ payload: { data: event?.data } }));
      this.messageService.add({
        severity: 'success',
        summary: 'Client Created',
        detail: 'Client has been created successfully',
      });
    } else if (event?.type === 'edit') {
      this.store$.dispatch(ClientActions.updateClient({ payload: { data: event?.data } }));
      this.messageService.add({
        severity: 'success',
        summary: 'Client Updated',
        detail: 'Client has been updated successfully',
      });
    }
  }

  onDeleteClient(event: any) {
    if (event?.type === 'multi')
      event?.data?.forEach((id: any) =>
        this.store$.dispatch(ClientActions.deleteClient({ payload: { id } })),
      );
    else this.store$.dispatch(ClientActions.deleteClient({ payload: { id: event?.data } }));
  }
}
