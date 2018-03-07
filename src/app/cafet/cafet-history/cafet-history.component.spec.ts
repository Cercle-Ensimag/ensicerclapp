import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetHistoryComponent } from './cafet-history.component';

describe('CafetHistoryComponent', () => {
  let component: CafetHistoryComponent;
  let fixture: ComponentFixture<CafetHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
