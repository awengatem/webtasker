import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSupervisorComponent } from './team-supervisor.component';

describe('TeamSupervisorComponent', () => {
  let component: TeamSupervisorComponent;
  let fixture: ComponentFixture<TeamSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamSupervisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
