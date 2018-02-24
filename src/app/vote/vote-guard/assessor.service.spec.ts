import { TestBed, inject } from '@angular/core/testing';

import { CanActivateAssessor } from './assessor.service';

describe('CanActivateAssessor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateAssessor]
    });
  });

  it('should be created', inject([CanActivateAssessor], (service: CanActivateAssessor) => {
    expect(service).toBeTruthy();
  }));
});
