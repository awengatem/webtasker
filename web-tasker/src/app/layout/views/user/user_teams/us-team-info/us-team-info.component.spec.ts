import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsTeamInfoComponent } from './us-team-info.component';

describe('UsTeamInfoComponent', () => {
  let component: UsTeamInfoComponent;
  let fixture: ComponentFixture<UsTeamInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsTeamInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsTeamInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
