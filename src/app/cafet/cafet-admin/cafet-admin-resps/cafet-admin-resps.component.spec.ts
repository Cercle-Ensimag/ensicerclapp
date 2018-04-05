import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetAdminRespsComponent } from './cafet-admin-resps.component';

describe('CafetAdminRespsComponent', () => {
  let component: CafetAdminRespsComponent;
  let fixture: ComponentFixture<CafetAdminRespsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetAdminRespsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetAdminRespsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
