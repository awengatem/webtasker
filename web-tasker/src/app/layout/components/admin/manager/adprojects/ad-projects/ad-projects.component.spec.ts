import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdProjectsComponent } from './ad-projects.component';

describe('AdProjectsComponent', () => {
  let component: AdProjectsComponent;
  let fixture: ComponentFixture<AdProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
