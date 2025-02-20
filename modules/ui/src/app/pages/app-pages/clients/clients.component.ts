import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '@/app/store/interfaces';
import {ClientActions} from '@/app/store/actions';
import {ClientSelectors} from '@/app/store/selectors';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ClientTableComponent} from '@/app/components/client-table/client-table.component';

@UntilDestroy()
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  imports: [
    ClientTableComponent
  ],
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  clientModalOpen = false;
  submitting = false;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.store$.dispatch(ClientActions.loadClients());
    this.store$.select(ClientSelectors.selectClients).pipe(untilDestroyed(this)).subscribe((clients: any) => {
      if (clients) {
        this.clients = clients;
        this.cdr.detectChanges();
      }
    });
  }

  onClientModalOpenToggle(event: any) {
    this.clientModalOpen = event?.open;
  }

  onSaveClient(event: any) {
    this.submitting = true;
    this.cdr.detectChanges();
    if (event?.type === 'new') this.store$.dispatch(ClientActions.saveClient({payload: {data: event?.data}}));
    else if (event?.type === 'edit') this.store$.dispatch(ClientActions.updateClient({payload: {data: event?.data}}));
  }

  onDeleteClient(event: any) {
    if (event?.type === 'multi') {
      event?.data?.forEach((id: any) => this.store$.dispatch(ClientActions.deleteClient({payload: {id}})));
    } else {
      this.store$.dispatch(ClientActions.deleteClient({payload: {id: event?.data}}));
    }
  }
}
