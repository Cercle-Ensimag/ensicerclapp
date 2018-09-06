import { TestBed, inject } from '@angular/core/testing';

import { CanActivateEventsEdit } from './events-edit.guard';

describe('CanActivateEventsEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateEventsEdit]
    });
  });

  it('should be created', inject([CanActivateEventsEdit], (service: CanActivateEventsEdit) => {
    expect(service).toBeTruthy();
  }));
});
