import { TestBed, inject } from '@angular/core/testing';

import { ActusService } from './actus.service';

describe('ActusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActusService]
    });
  });

  it('should be created', inject([ActusService], (service: ActusService) => {
    expect(service).toBeTruthy();
  }));
});
