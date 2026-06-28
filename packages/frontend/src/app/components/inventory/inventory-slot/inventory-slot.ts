import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { HydratedItem } from '@tier5/bungie-api';
import { InventoryItem } from '../inventory-item/inventory-item';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

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
  items = input.required<HydratedItem[]>();
  slotName = input<string>('unknown');
  isVault = input<boolean>(false);

  @Output() itemDropped = new EventEmitter<CdkDragDrop<any>>();

  protected readonly equippedItem = computed(() => {
    return this.items().find(i => i.equipped);
  });
  protected readonly inventoryPool = computed(() => {
    return this.isVault() ? this.items() : this.items().filter(i => !i.equipped);
  });

  onDrop(event: CdkDragDrop<any>) {
    console.log('--- Drag and Drop Event ---');
    console.log(`Dropped from: ${event.previousContainer.id} to ${event.container.id}`);    console.log('Event details:', event);
    this.itemDropped.emit(event);
  }

  enterPredicate() {
    return true;
  }
}
