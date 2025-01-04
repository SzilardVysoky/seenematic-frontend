import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { genreSelectionGuard } from './genre-selection.guard';

describe('genreSelectionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => genreSelectionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
