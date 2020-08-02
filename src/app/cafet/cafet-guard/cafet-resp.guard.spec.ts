import { inject, TestBed } from '@angular/core/testing';

import { CanActivateCafetResp } from './cafet-resp.guard';

describe('CanActivateCafetResp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateCafetResp]
    });
  });

  it('should ...', inject([CanActivateCafetResp], (guard: CanActivateCafetResp) => {
    expect(guard).toBeTruthy();
  }));
});
