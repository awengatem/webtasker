import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTeammodalComponent } from './new-teammodal.component';

describe('NewTeammodalComponent', () => {
  let component: NewTeammodalComponent;
  let fixture: ComponentFixture<NewTeammodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTeammodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTeammodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
