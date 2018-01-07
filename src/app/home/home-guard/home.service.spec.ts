import { TestBed, inject } from '@angular/core/testing';

import { CanActivateHome } from './home.service';

describe('CanActivateHome', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardHomeService]
    });
  });

  it('should be created', inject([CanActivateHome], (service: CanActivateHome) => {
    expect(service).toBeTruthy();
  }));
});
