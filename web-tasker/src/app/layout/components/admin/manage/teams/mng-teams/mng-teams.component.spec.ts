import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngTeamsComponent } from './mng-teams.component';

describe('MngTeamsComponent', () => {
  let component: MngTeamsComponent;
  let fixture: ComponentFixture<MngTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MngTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MngTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
