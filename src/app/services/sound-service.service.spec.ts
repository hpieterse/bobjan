import { TestBed } from '@angular/core/testing';

import { SoundServiceService } from './sound-service.service';

describe('SoundServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoundServiceService = TestBed.get(SoundServiceService);
    expect(service).toBeTruthy();
  });
});
