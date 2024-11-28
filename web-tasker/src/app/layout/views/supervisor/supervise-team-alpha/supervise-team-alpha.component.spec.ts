import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseTeamAlphaComponent } from './supervise-team-alpha.component';

describe('SuperviseTeamAlphaComponent', () => {
  let component: SuperviseTeamAlphaComponent;
  let fixture: ComponentFixture<SuperviseTeamAlphaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperviseTeamAlphaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseTeamAlphaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
