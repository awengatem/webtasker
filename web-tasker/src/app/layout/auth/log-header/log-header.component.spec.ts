import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogHeaderComponent } from './log-header.component';

describe('LogHeaderComponent', () => {
  let component: LogHeaderComponent;
  let fixture: ComponentFixture<LogHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
