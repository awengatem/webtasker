import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseProjectInfoModalComponent } from './supervise-project-info-modal.component';

describe('SuperviseProjectInfoModalComponent', () => {
  let component: SuperviseProjectInfoModalComponent;
  let fixture: ComponentFixture<SuperviseProjectInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperviseProjectInfoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseProjectInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
