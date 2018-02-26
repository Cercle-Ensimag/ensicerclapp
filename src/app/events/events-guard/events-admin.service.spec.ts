import { TestBed, inject } from '@angular/core/testing';

import { CanActivateEventsAdmin } from './events-admin.service';

describe('CanActivateEventsAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateEventsAdmin]
    });
  });

  it('should be created', inject([CanActivateEventsAdmin], (service: CanActivateEventsAdmin) => {
    expect(service).toBeTruthy();
  }));
});
