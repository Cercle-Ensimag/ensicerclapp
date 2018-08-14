import { TestBed, async, inject } from '@angular/core/testing';

import { AnnoncesGuard } from './annonces.guard';

describe('AnnoncesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnoncesGuard]
    });
  });

  it('should ...', inject([AnnoncesGuard], (guard: AnnoncesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
