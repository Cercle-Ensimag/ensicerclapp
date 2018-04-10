import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrezoComponent } from './trezo.component';

describe('TrezoComponent', () => {
  let component: TrezoComponent;
  let fixture: ComponentFixture<TrezoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrezoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrezoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
