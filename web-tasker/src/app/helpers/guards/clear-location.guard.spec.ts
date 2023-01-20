import { TestBed } from '@angular/core/testing';

import { ClearLocationGuard } from './clear-location.guard';

describe('ClearLocationGuard', () => {
  let guard: ClearLocationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ClearLocationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
