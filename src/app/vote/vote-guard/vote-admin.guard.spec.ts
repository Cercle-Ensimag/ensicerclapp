import { TestBed, inject } from '@angular/core/testing';

import { CanActivateVoteAdmin } from './vote-admin.guard';

describe('CanActivateVoteAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateVoteAdmin]
    });
  });

  it('should be created', inject([CanActivateVoteAdmin], (service: CanActivateVoteAdmin) => {
    expect(service).toBeTruthy();
  }));
});
