import { TestBed, async, inject } from '@angular/core/testing';

import { JobAdsGuard } from './jobads.guard';

describe('JobAdsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobAdsGuard]
    });
  });

  it('should ...', inject([JobAdsGuard], (guard: JobAdsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
