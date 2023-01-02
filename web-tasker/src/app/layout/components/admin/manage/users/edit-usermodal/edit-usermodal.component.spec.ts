import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsermodalComponent } from './edit-usermodal.component';

describe('EditUsermodalComponent', () => {
  let component: EditUsermodalComponent;
  let fixture: ComponentFixture<EditUsermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUsermodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUsermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
