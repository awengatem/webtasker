import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseTeamPage2Component } from './supervise-team-page2.component';

describe('SuperviseTeamPage2Component', () => {
  let component: SuperviseTeamPage2Component;
  let fixture: ComponentFixture<SuperviseTeamPage2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperviseTeamPage2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseTeamPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
