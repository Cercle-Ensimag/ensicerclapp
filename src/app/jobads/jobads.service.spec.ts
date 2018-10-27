import { TestBed, inject } from '@angular/core/testing';

import { JobAdsService } from './jobads.service';

describe('JobAdsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobAdsService]
    });
  });

  it('should be created', inject([JobAdsService], (service: JobAdsService) => {
    expect(service).toBeTruthy();
  }));
});
