import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CafetRespComponent } from './cafet-resp.component';

describe('CafetRespComponent', () => {
  let component: CafetRespComponent;
  let fixture: ComponentFixture<CafetRespComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CafetRespComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CafetRespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
