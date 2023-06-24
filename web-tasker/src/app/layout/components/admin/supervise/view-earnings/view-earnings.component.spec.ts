import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEarningsComponent } from './view-earnings.component';

describe('ViewEarningsComponent', () => {
  let component: ViewEarningsComponent;
  let fixture: ComponentFixture<ViewEarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEarningsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
