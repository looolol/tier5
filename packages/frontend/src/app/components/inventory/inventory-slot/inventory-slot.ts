import { Component, computed, Input } from '@angular/core';
import { HydratedItem } from '@tier5/bungie-api';
import { InventoryItem } from '../inventory-item/inventory-item';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-inventory-slot',
  imports: [
    CommonModule,
    DragDropModule,
    InventoryItem,
  ],
  templateUrl: './inventory-slot.html',
  styleUrl: './inventory-slot.scss',
})
export class InventorySlot {
  @Input({ required: true }) items: HydratedItem[] = [];
  @Input() isVault = false;

  protected readonly equippedItem = computed(() => this.items.find(i => i.equipped));
  protected readonly inventoryPool = computed(() => this.isVault ? this.items : this.items.filter(i => !i.equipped));
}
