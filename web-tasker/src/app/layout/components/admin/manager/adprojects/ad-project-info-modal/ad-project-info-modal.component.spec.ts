import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdProjectInfoModalComponent } from './ad-project-info-modal.component';

describe('AdProjectInfoModalComponent', () => {
  let component: AdProjectInfoModalComponent;
  let fixture: ComponentFixture<AdProjectInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdProjectInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdProjectInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
