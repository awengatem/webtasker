import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillEarningsComponent } from './fill-earnings.component';

describe('FillEarningsComponent', () => {
  let component: FillEarningsComponent;
  let fixture: ComponentFixture<FillEarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillEarningsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
