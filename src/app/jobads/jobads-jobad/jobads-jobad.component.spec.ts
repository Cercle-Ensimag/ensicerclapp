import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdsJobAdComponent } from './jobads-jobad.component';

describe('JobAdsJobAdComponent', () => {
  let component: JobAdsJobAdComponent;
  let fixture: ComponentFixture<JobAdsJobAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAdsJobAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdsJobAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
