import { TestBed } from '@angular/core/testing';

import { ServiceActivityIndicatorService } from './service-activity-indicator.service';

describe('ServiceActivityIndicatorService', () => {
  let service: ServiceActivityIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceActivityIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
