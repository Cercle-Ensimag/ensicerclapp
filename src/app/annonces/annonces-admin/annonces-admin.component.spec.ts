import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesAdminComponent } from './annonces-admin.component';

describe('AnnoncesAdminComponent', () => {
  let component: AnnoncesAdminComponent;
  let fixture: ComponentFixture<AnnoncesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoncesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoncesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
