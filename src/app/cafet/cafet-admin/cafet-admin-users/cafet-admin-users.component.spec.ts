import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetAdminUsersComponent } from './cafet-admin-users.component';

describe('CafetAdminUsersComponent', () => {
  let component: CafetAdminUsersComponent;
  let fixture: ComponentFixture<CafetAdminUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetAdminUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetAdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
