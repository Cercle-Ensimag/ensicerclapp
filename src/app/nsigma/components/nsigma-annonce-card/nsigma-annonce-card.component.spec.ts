import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsigmaAnnonceCardComponent } from './nsigma-annonce-card.component';

describe('NsigmaAnnonceComponent', () => {
  let component: NsigmaAnnonceCardComponent;
  let fixture: ComponentFixture<NsigmaAnnonceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsigmaAnnonceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsigmaAnnonceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
