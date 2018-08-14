import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsigmaHomeComponent } from './nsigma-home.component';

describe('NsigmaHomeComponent', () => {
  let component: NsigmaHomeComponent;
  let fixture: ComponentFixture<NsigmaHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsigmaHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsigmaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
