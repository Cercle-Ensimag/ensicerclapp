import { TestBed, inject } from '@angular/core/testing';

import { NsigmaService } from './nsigma.service';

describe('NsigmaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NsigmaService]
    });
  });

  it('should be created', inject([NsigmaService], (service: NsigmaService) => {
    expect(service).toBeTruthy();
  }));
});
