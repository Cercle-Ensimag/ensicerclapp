import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuCardComponent } from './actu-card.component';

describe('ActuCardComponent', () => {
  let component: ActuCardComponent;
  let fixture: ComponentFixture<ActuCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActuCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActuCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
