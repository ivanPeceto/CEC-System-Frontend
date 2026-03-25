import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRecetaDetailsModal } from './show-receta-details-modal';

describe('ShowRecetaDetailsModal', () => {
  let component: ShowRecetaDetailsModal;
  let fixture: ComponentFixture<ShowRecetaDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowRecetaDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRecetaDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
