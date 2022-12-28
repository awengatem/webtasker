import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngSessionsComponent } from './mng-sessions.component';

describe('MngSessionsComponent', () => {
  let component: MngSessionsComponent;
  let fixture: ComponentFixture<MngSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MngSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MngSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
