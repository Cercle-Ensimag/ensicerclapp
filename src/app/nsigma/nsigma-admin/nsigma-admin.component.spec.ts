import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsigmaAdminComponent } from './nsigma-admin.component';

describe('NsigmaAdminComponent', () => {
  let component: NsigmaAdminComponent;
  let fixture: ComponentFixture<NsigmaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsigmaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsigmaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
