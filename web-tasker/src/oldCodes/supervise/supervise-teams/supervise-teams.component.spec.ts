import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseTeamsComponent } from './supervise-teams.component';

describe('SuperviseTeamsComponent', () => {
  let component: SuperviseTeamsComponent;
  let fixture: ComponentFixture<SuperviseTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperviseTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
