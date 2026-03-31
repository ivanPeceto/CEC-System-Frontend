import { TestBed } from '@angular/core/testing';

import { ReglasPrecioService } from './reglas-precio-service';

describe('ReglasPrecio', () => {
  let service: ReglasPrecioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReglasPrecioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
