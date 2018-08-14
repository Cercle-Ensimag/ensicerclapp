import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsigmaEditComponent } from './nsigma-edit.component';

describe('NsigmaEditComponent', () => {
  let component: NsigmaEditComponent;
  let fixture: ComponentFixture<NsigmaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsigmaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsigmaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
