import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTeammodalComponent } from './edit-teammodal.component';

describe('EditTeammodalComponent', () => {
  let component: EditTeammodalComponent;
  let fixture: ComponentFixture<EditTeammodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTeammodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTeammodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
