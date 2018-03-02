import { TestBed, inject } from '@angular/core/testing';

import { CalService } from './cal.service';

describe('CalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalService]
    });
  });

  it('should be created', inject([CalService], (service: CalService) => {
    expect(service).toBeTruthy();
  }));
});
