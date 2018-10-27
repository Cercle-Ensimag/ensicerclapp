import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsigmaJobAdCardComponent } from './nsigma-jobad-card.component';

describe('NsigmaJobAdComponent', () => {
  let component: NsigmaJobAdCardComponent;
  let fixture: ComponentFixture<NsigmaJobAdCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsigmaJobAdCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsigmaJobAdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
