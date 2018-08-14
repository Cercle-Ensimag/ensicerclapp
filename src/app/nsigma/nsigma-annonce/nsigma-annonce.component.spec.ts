import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsigmaAnnonceComponent } from './nsigma-annonce.component';

describe('NsigmaAnnonceComponent', () => {
  let component: NsigmaAnnonceComponent;
  let fixture: ComponentFixture<NsigmaAnnonceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsigmaAnnonceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsigmaAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
