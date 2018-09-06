import { TestBed, inject } from '@angular/core/testing';

import { CanActivateHome } from './home.guard';

describe('CanActivateHome', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateHome]
    });
  });

  it('should be created', inject([CanActivateHome], (service: CanActivateHome) => {
    expect(service).toBeTruthy();
  }));
});
