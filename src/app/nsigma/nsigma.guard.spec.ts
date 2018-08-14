import { TestBed, async, inject } from '@angular/core/testing';

import { NsigmaGuard } from './nsigma.guard';

describe('NsigmaGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NsigmaGuard]
    });
  });

  it('should ...', inject([NsigmaGuard], (guard: NsigmaGuard) => {
    expect(guard).toBeTruthy();
  }));
});
