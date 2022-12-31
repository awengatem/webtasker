import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngUsersComponent } from './mng-users.component';

describe('MngUsersComponent', () => {
  let component: MngUsersComponent;
  let fixture: ComponentFixture<MngUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MngUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MngUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
