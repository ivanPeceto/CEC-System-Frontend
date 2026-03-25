import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleSubrecetasModal } from './handle-subrecetas-modal';

describe('HandleSubrecetasModal', () => {
  let component: HandleSubrecetasModal;
  let fixture: ComponentFixture<HandleSubrecetasModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleSubrecetasModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleSubrecetasModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
