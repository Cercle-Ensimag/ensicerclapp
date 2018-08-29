import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnonceCardComponent } from './annonce-card.component';

describe('AnnonceCardComponent', () => {
  let component: AnnonceCardComponent;
  let fixture: ComponentFixture<AnnonceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnonceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnonceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
