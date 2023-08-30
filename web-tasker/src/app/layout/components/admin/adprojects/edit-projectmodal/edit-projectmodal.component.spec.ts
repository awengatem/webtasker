import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectmodalComponent } from './edit-projectmodal.component';

describe('EditProjectmodalComponent', () => {
  let component: EditProjectmodalComponent;
  let fixture: ComponentFixture<EditProjectmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProjectmodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProjectmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
