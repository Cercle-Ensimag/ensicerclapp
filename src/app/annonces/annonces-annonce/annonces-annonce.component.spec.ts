import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesAnnonceComponent } from './annonces-annonce.component';

describe('AnnoncesAnnonceComponent', () => {
  let component: AnnoncesAnnonceComponent;
  let fixture: ComponentFixture<AnnoncesAnnonceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoncesAnnonceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoncesAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
