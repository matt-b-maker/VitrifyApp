import { TestBed } from '@angular/core/testing';

import { IngredientTypesService } from './ingredient-types.service';

describe('IngredientTypesService', () => {
  let service: IngredientTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
