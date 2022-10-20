import { TestBed } from '@angular/core/testing';

import { ProjectStatusService } from './project-status.service';

describe('ProjectStatusService', () => {
  let service: ProjectStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
