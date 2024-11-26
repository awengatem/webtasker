import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseTeams2Component } from './supervise-teams2.component';

describe('SuperviseTeams2Component', () => {
  let component: SuperviseTeams2Component;
  let fixture: ComponentFixture<SuperviseTeams2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperviseTeams2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseTeams2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
