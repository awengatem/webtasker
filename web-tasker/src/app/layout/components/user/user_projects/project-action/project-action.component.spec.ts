import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActionComponent } from './project-action.component';

describe('ProjectActionComponent', () => {
  let component: ProjectActionComponent;
  let fixture: ComponentFixture<ProjectActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
