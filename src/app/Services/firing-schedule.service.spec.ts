import { TestBed } from '@angular/core/testing';

import { FiringScheduleService } from './firing-schedule.service';

describe('FiringScheduleService', () => {
  let service: FiringScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiringScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
