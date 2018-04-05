import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetAdminArchivesComponent } from './cafet-admin-archives.component';

describe('CafetAdminArchivesComponent', () => {
  let component: CafetAdminArchivesComponent;
  let fixture: ComponentFixture<CafetAdminArchivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetAdminArchivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetAdminArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
