import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalSettingsComponent } from './cal-settings.component';

describe('CalSettingsComponent', () => {
  let component: CalSettingsComponent;
  let fixture: ComponentFixture<CalSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
