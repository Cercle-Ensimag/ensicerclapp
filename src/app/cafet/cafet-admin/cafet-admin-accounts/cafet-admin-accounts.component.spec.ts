import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetAdminAccountsComponent } from './cafet-admin-accounts.component';

describe('CafetAdminAccountsComponent', () => {
  let component: CafetAdminAccountsComponent;
  let fixture: ComponentFixture<CafetAdminAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetAdminAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetAdminAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
