import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleInsumosModal } from './handle-insumos-modal';

describe('HandleInsumosModal', () => {
  let component: HandleInsumosModal;
  let fixture: ComponentFixture<HandleInsumosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleInsumosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleInsumosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
