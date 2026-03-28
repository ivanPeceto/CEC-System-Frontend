import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosManagment } from './productos-managment';

describe('ProductosManagment', () => {
  let component: ProductosManagment;
  let fixture: ComponentFixture<ProductosManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
