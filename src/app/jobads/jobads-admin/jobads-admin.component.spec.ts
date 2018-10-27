import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdsAdminComponent } from './jobads-admin.component';

describe('JobAdsAdminComponent', () => {
  let component: JobAdsAdminComponent;
  let fixture: ComponentFixture<JobAdsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAdsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
