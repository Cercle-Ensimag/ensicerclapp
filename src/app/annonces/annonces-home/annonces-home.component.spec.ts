import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesHomeComponent } from './annonces-home.component';

describe('AnnoncesHomeComponent', () => {
  let component: AnnoncesHomeComponent;
  let fixture: ComponentFixture<AnnoncesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoncesHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoncesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
