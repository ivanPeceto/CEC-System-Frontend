import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosCategoriasContainer } from './productos-categorias-container';

describe('ProductosCategoriasContainer', () => {
  let component: ProductosCategoriasContainer;
  let fixture: ComponentFixture<ProductosCategoriasContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosCategoriasContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosCategoriasContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
