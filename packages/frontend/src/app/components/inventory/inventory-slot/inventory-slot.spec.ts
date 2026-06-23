import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySlot } from './inventory-slot';

describe('InventorySlot', () => {
  let component: InventorySlot;
  let fixture: ComponentFixture<InventorySlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySlot],
    }).compileComponents();

    fixture = TestBed.createComponent(InventorySlot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
