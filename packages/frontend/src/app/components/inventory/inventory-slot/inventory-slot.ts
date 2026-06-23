import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { HydratedItem } from '@tier5/bungie-api';
import { InventoryItem } from '../inventory-item/inventory-item';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

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
  @Output() itemDropped = new EventEmitter<CdkDragDrop<any>>();

  protected readonly equippedItem = computed(() => this.items.find(i => i.equipped));
  protected readonly inventoryPool = computed(() => this.isVault ? this.items : this.items.filter(i => !i.equipped));

  onDrop(event: CdkDragDrop<any>) {
    console.log('cdkDragDrop', event);
    this.itemDropped.emit(event);
  }

  enterPredicate() {
    return true;
  }
}
