import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComRespComponent } from './com-resp.component';

describe('ComRespComponent', () => {
  let component: ComRespComponent;
  let fixture: ComponentFixture<ComRespComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComRespComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComRespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
