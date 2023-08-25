import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperviseMainPageComponent } from './supervise-main-page.component';

describe('SuperviseMainPageComponent', () => {
  let component: SuperviseMainPageComponent;
  let fixture: ComponentFixture<SuperviseMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperviseMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperviseMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
