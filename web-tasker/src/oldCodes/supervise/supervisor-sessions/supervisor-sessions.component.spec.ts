import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorSessionsComponent } from './supervisor-sessions.component';

describe('SupervisorSessionsComponent', () => {
  let component: SupervisorSessionsComponent;
  let fixture: ComponentFixture<SupervisorSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
