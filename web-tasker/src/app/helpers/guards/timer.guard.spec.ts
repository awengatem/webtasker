import { TestBed } from '@angular/core/testing';

import { TimerGuard } from './timer.guard';

describe('TimerGuard', () => {
  let guard: TimerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TimerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
