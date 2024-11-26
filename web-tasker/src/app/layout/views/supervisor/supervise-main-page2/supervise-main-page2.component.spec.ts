import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseMainPage2Component } from './supervise-main-page2.component';

describe('SuperviseMainPage2Component', () => {
  let component: SuperviseMainPage2Component;
  let fixture: ComponentFixture<SuperviseMainPage2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperviseMainPage2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseMainPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
