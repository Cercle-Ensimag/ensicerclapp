import { TestBed, inject } from '@angular/core/testing';

import { DicoService } from './dico.service';

describe('DicoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DicoService]
    });
  });

  it('should be created', inject([DicoService], (service: DicoService) => {
    expect(service).toBeTruthy();
  }));
});
