import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsigmaJobAdComponent } from './nsigma-jobad.component';

describe('NsigmaJobAdComponent', () => {
  let component: NsigmaJobAdComponent;
  let fixture: ComponentFixture<NsigmaJobAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsigmaJobAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsigmaJobAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
