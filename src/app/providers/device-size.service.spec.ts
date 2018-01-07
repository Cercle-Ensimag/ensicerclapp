import { TestBed, inject } from '@angular/core/testing';

import { DeviceSizeService } from './device-size.service';

describe('DeviceSizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceSizeService]
    });
  });

  it('should be created', inject([DeviceSizeService], (service: DeviceSizeService) => {
    expect(service).toBeTruthy();
  }));
});
