import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuAdminComponent } from './actu-admin.component';

describe('ActuAdminComponent', () => {
  let component: ActuAdminComponent;
  let fixture: ComponentFixture<ActuAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActuAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActuAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
