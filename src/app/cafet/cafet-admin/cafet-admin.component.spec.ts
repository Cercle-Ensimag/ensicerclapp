import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetAdminComponent } from './cafet-admin.component';

describe('CafetAdminComponent', () => {
  let component: CafetAdminComponent;
  let fixture: ComponentFixture<CafetAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
