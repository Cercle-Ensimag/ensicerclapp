import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdsEditComponent } from './jobads-edit.component';

describe('JobAdsEditComponent', () => {
  let component: JobAdsEditComponent;
  let fixture: ComponentFixture<JobAdsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAdsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
