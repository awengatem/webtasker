import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectModalComponent } from './new-project.component';

describe('NewProjectComponent', () => {
  let component: NewProjectModalComponent;
  let fixture: ComponentFixture<NewProjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewProjectModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
