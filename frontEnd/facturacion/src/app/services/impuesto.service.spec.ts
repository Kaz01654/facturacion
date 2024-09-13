import { TestBed } from '@angular/core/testing';

import { ImpuestoService } from './impuesto.service';

describe('ImpuestoService', () => {
  let service: ImpuestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpuestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
