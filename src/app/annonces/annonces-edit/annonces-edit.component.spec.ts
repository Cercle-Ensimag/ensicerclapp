import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesEditComponent } from './annonces-edit.component';

describe('AnnoncesEditComponent', () => {
  let component: AnnoncesEditComponent;
  let fixture: ComponentFixture<AnnoncesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoncesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoncesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
