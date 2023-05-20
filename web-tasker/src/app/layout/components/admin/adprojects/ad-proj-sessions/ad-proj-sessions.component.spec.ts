import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdProjSessionsComponent } from './ad-proj-sessions.component';

describe('AdProjSessionsComponent', () => {
  let component: AdProjSessionsComponent;
  let fixture: ComponentFixture<AdProjSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdProjSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdProjSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
