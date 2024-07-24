import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjSessionsComponent } from './proj-sessions.component';

describe('ProjSessionsComponent', () => {
  let component: ProjSessionsComponent;
  let fixture: ComponentFixture<ProjSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
