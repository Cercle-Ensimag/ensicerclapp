import { TestBed, inject } from '@angular/core/testing';

import { AppModulesService } from './app-modules.service';

describe('AppModulesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppModulesService]
    });
  });

  it('should be created', inject([AppModulesService], (service: AppModulesService) => {
    expect(service).toBeTruthy();
  }));
});
