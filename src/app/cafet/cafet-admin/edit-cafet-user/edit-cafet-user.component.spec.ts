import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCafetUserComponent } from './edit-cafet-user.component';

describe('EditCafetUserComponent', () => {
  let component: EditCafetUserComponent;
  let fixture: ComponentFixture<EditCafetUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCafetUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCafetUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
