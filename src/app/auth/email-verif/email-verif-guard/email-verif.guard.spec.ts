import { TestBed, async, inject } from '@angular/core/testing';

import { EmailVerifGuard } from './email-verif.guard';

describe('EmailVerifGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailVerifGuard]
    });
  });

  it('should ...', inject([EmailVerifGuard], (guard: EmailVerifGuard) => {
    expect(guard).toBeTruthy();
  }));
});
