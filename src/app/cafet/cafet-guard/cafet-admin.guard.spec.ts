import { TestBed, inject } from '@angular/core/testing';

import { CanActivateCafetAdmin } from './cafet-admin.guard';

describe('CanActivateCafetAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateCafetAdmin]
    });
  });

  it('should be created', inject([CanActivateCafetAdmin], (service: CanActivateCafetAdmin) => {
    expect(service).toBeTruthy();
  }));
});
