import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngEarningsComponent } from './mng-earnings.component';

describe('MngEarningsComponent', () => {
  let component: MngEarningsComponent;
  let fixture: ComponentFixture<MngEarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MngEarningsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MngEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
