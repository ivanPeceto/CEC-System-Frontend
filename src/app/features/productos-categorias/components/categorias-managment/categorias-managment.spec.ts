import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasManagment } from './categorias-managment';

describe('CategoriasManagment', () => {
  let component: CategoriasManagment;
  let fixture: ComponentFixture<CategoriasManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
