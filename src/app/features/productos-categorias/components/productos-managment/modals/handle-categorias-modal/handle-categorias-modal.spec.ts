import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleCategoriasModal } from './handle-categorias-modal';

describe('HandleCategoriasModal', () => {
  let component: HandleCategoriasModal;
  let fixture: ComponentFixture<HandleCategoriasModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleCategoriasModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleCategoriasModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
