import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdsHomeComponent } from './jobads-home.component';

describe('JobAdsHomeComponent', () => {
  let component: JobAdsHomeComponent;
  let fixture: ComponentFixture<JobAdsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAdsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
