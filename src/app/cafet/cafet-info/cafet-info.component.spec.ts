import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetInfoComponent } from './cafet-info.component';

describe('CafetInfoComponent', () => {
  let component: CafetInfoComponent;
  let fixture: ComponentFixture<CafetInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
