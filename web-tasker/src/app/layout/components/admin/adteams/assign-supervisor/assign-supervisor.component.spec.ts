import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSupervisorComponent } from './assign-supervisor.component';

describe('AssignSupervisorComponent', () => {
  let component: AssignSupervisorComponent;
  let fixture: ComponentFixture<AssignSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSupervisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
