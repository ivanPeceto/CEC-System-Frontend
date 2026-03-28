import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleRecetasModal } from './handle-recetas-modal';

describe('HandleRecetasModal', () => {
  let component: HandleRecetasModal;
  let fixture: ComponentFixture<HandleRecetasModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleRecetasModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleRecetasModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
