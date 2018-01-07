import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetComponent } from './cafet.component';

describe('CafetComponent', () => {
  let component: CafetComponent;
  let fixture: ComponentFixture<CafetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
