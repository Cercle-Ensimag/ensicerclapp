import { TestBed, inject } from '@angular/core/testing';

import { CanActivateAdmin } from './admin-guard.service';

describe('CanActivateAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateAdmin]
    });
  });

  it('should be created', inject([CanActivateAdmin], (service: CanActivateAdmin) => {
    expect(service).toBeTruthy();
  }));
});
