import { TestBed } from '@angular/core/testing';

import { ChemistryCalculatorService } from './chemistry-calculator.service';

describe('ChemistryCalculatorService', () => {
  let service: ChemistryCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChemistryCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
