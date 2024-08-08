import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseTeaminfoComponent } from './supervise-teaminfo.component';

describe('SuperviseTeaminfoComponent', () => {
  let component: SuperviseTeaminfoComponent;
  let fixture: ComponentFixture<SuperviseTeaminfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperviseTeaminfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseTeaminfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
