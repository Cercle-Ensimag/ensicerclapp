import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActusHomeComponent } from './actus-home.component';

describe('ActusHomeComponent', () => {
  let component: ActusHomeComponent;
  let fixture: ComponentFixture<ActusHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActusHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActusHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
