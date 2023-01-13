import { TestBed } from '@angular/core/testing';

import { DispositionService } from './disposition.service';

describe('DispositionService', () => {
  let service: DispositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
