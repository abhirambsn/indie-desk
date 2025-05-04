import { TestBed } from '@angular/core/testing';

import { KpiService } from './kpi.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('KpiService', () => {
  let service: KpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(KpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
