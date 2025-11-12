import { TestBed } from '@angular/core/testing';

import { AuthGurd } from './auth.gurd';

describe('AuthGurd', () => {
  let service: AuthGurd;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGurd);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
