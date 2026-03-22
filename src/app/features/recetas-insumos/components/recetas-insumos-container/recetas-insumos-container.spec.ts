import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetasInsumosContainer } from './recetas-insumos-container';

describe('RecetasInsumosContainer', () => {
  let component: RecetasInsumosContainer;
  let fixture: ComponentFixture<RecetasInsumosContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetasInsumosContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetasInsumosContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
