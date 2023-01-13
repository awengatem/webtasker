import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSessionsComponent } from './recent-sessions.component';

describe('RecentSessionsComponent', () => {
  let component: RecentSessionsComponent;
  let fixture: ComponentFixture<RecentSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
