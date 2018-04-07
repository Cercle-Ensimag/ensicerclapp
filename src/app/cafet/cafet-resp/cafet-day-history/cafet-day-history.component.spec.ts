import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetDayHistoryComponent } from './cafet-day-history.component';

describe('CafetDayHistoryComponent', () => {
  let component: CafetDayHistoryComponent;
  let fixture: ComponentFixture<CafetDayHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetDayHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetDayHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
