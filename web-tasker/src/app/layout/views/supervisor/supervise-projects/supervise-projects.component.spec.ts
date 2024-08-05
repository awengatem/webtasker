import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseProjectsComponent } from './supervise-projects.component';

describe('SuperviseProjectsComponent', () => {
  let component: SuperviseProjectsComponent;
  let fixture: ComponentFixture<SuperviseProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperviseProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
