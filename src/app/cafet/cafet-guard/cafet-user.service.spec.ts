import { TestBed, inject } from '@angular/core/testing';

import { CanActivateCafetUser } from './cafet-user.service';

describe('CanActivateCafetUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateCafetUser]
    });
  });

  it('should be created', inject([CanActivateCafetUser], (service: CanActivateCafetUser) => {
    expect(service).toBeTruthy();
  }));
});
