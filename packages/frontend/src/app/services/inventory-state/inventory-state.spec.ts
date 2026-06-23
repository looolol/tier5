import { TestBed } from '@angular/core/testing';

import { InventoryState } from './inventory-state';

describe('InventoryState', () => {
  let service: InventoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
