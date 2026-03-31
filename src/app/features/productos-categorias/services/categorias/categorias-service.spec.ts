import { TestBed } from '@angular/core/testing';

import { CategoriasService } from './categorias-service';

describe('Categorias', () => {
  let service: CategoriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
