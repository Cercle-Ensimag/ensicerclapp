import { TestBed, inject } from '@angular/core/testing';

import { CanActivateJournalist } from './journalist.guard';

describe('CanActivateJournalist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateJournalist]
    });
  });

  it('should be created', inject([CanActivateJournalist], (service: CanActivateJournalist) => {
    expect(service).toBeTruthy();
  }));
});
