import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/interfaces';
import {ClientActions} from '../../../store/actions';
import {ClientSelectors} from '../../../store/selectors';
import {Client} from '../../../types';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ClientTableComponent} from '../../../components/client-table/client-table.component';

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

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.store$.dispatch(ClientActions.loadClients());
    this.store$.select(ClientSelectors.selectClients).pipe(untilDestroyed(this)).subscribe((clients: any) => {
      console.log('DEBUG: ', clients);
      if (clients) {
        this.clients = clients;
        this.cdr.detectChanges();
      }
    });
  }
}
