import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglasPrecioManagmentModal } from './reglas-precio-managment-modal';

describe('ReglasPrecioManagmentModal', () => {
  let component: ReglasPrecioManagmentModal;
  let fixture: ComponentFixture<ReglasPrecioManagmentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReglasPrecioManagmentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReglasPrecioManagmentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
