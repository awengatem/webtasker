import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseEarningPageComponent } from './supervise-earning-page.component';

describe('SuperviseEarningPageComponent', () => {
  let component: SuperviseEarningPageComponent;
  let fixture: ComponentFixture<SuperviseEarningPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperviseEarningPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseEarningPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
