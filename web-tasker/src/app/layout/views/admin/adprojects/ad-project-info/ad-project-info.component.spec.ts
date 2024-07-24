import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdProjectInfoComponent } from './ad-project-info.component';

describe('AdProjectInfoComponent', () => {
  let component: AdProjectInfoComponent;
  let fixture: ComponentFixture<AdProjectInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdProjectInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdProjectInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
