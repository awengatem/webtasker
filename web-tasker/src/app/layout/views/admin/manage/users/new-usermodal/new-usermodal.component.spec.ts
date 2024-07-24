import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUsermodalComponent } from './new-usermodal.component';

describe('NewUsermodalComponent', () => {
  let component: NewUsermodalComponent;
  let fixture: ComponentFixture<NewUsermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewUsermodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUsermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
