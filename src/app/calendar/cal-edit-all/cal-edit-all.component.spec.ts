import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalEditAllComponent } from './cal-edit-all.component';

describe('CalEditAllComponent', () => {
  let component: CalEditAllComponent;
  let fixture: ComponentFixture<CalEditAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalEditAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalEditAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
