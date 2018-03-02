import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCalComponent } from './edit-cal.component';

describe('EditCalComponent', () => {
  let component: EditCalComponent;
  let fixture: ComponentFixture<EditCalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
