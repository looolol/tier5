import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryColumn } from './inventory-column';

describe('InventoryColumn', () => {
  let component: InventoryColumn;
  let fixture: ComponentFixture<InventoryColumn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryColumn],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryColumn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
