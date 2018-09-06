import { TestBed, inject } from '@angular/core/testing';

import { CanActivateActusAdmin } from './actus-admin.guard';

describe('CanActivateActusAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateActusAdmin]
    });
  });

  it('should be created', inject([CanActivateActusAdmin], (service: CanActivateActusAdmin) => {
    expect(service).toBeTruthy();
  }));
});
