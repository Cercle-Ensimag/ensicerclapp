import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActusComponent } from './edit-actus.component';

describe('EditActusComponent', () => {
  let component: EditActusComponent;
  let fixture: ComponentFixture<EditActusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditActusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditActusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
