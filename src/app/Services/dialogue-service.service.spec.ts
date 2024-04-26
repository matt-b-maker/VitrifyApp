import { TestBed } from '@angular/core/testing';

import { DialogueService } from './dialogue-service.service';

describe('DialogueServiceService', () => {
  let service: DialogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
