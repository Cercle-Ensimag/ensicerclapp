import { TestBed, inject } from '@angular/core/testing';

import { Tools } from './tools.service';

describe('Tools', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Tools]
    });
  });

  it('should be created', inject([Tools], (service: Tools) => {
    expect(service).toBeTruthy();
  }));
});
