import { TestBed } from '@angular/core/testing';

import { GlazeLogoGetterService } from './glaze-logo-getter.service';

describe('GlazeLogoGetterService', () => {
  let service: GlazeLogoGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlazeLogoGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
