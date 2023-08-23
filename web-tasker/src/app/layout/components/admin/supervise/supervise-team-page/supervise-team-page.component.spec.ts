import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseTeamPageComponent } from './supervise-team-page.component';

describe('SuperviseTeamPageComponent', () => {
  let component: SuperviseTeamPageComponent;
  let fixture: ComponentFixture<SuperviseTeamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperviseTeamPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseTeamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
