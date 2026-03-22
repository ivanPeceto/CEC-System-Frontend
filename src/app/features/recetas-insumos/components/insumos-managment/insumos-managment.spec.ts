import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosManagment } from './insumos-managment';

describe('InsumosManagment', () => {
  let component: InsumosManagment;
  let fixture: ComponentFixture<InsumosManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
