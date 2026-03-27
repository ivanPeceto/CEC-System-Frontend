import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProductoDetailsModal } from './show-producto-details-modal';

describe('ShowProductoDetailsModal', () => {
  let component: ShowProductoDetailsModal;
  let fixture: ComponentFixture<ShowProductoDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowProductoDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowProductoDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
