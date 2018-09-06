import { TestBed, inject } from '@angular/core/testing';

import { CanActivateActusEdit } from './actus-edit.guard';

describe('CanActivateActusEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateActusEdit]
    });
  });

  it('should be created', inject([CanActivateActusEdit], (service: CanActivateActusEdit) => {
    expect(service).toBeTruthy();
  }));
});
