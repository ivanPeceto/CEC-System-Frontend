import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesManagment } from './clientes-managment';

describe('ClientesManagment', () => {
  let component: ClientesManagment;
  let fixture: ComponentFixture<ClientesManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
