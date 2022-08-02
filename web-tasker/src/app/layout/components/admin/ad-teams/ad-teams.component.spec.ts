import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdTeamsComponent } from './ad-teams.component';

describe('AdTeamsComponent', () => {
  let component: AdTeamsComponent;
  let fixture: ComponentFixture<AdTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
