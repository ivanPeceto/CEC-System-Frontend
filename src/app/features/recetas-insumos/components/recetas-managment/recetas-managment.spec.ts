import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetasManagment } from './recetas-managment';

describe('RecetasManagment', () => {
  let component: RecetasManagment;
  let fixture: ComponentFixture<RecetasManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetasManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetasManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
