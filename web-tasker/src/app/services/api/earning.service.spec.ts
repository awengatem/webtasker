import { TestBed } from '@angular/core/testing';

import { EarningService } from './earning.service';

describe('EarningService', () => {
  let service: EarningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
