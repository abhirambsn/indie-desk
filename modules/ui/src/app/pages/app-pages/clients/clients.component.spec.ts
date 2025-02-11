import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsComponent } from './clients.component';
import {provideMockStore} from '@ngrx/store/testing';
import _ from 'lodash';
import {initialAppState} from '../../../store/constants/app.constants';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [ClientsComponent],
      providers: [
        provideMockStore({initialState})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
