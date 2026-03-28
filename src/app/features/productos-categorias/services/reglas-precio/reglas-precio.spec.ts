import { TestBed } from '@angular/core/testing';

import { ReglasPrecio } from './reglas-precio';

describe('ReglasPrecio', () => {
  let service: ReglasPrecio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReglasPrecio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
