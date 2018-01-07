import { TestBed, inject } from '@angular/core/testing';

import { CafetService } from './cafet.service';

describe('CafetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CafetService]
    });
  });

  it('should be created', inject([CafetService], (service: CafetService) => {
    expect(service).toBeTruthy();
  }));
});
