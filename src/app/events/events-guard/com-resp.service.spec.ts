import { TestBed, inject } from '@angular/core/testing';

import { CanActivateComResp } from './com-resp.service';

describe('CanActivateComResp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateComResp]
    });
  });

  it('should be created', inject([CanActivateComResp], (service: CanActivateComResp) => {
    expect(service).toBeTruthy();
  }));
});
