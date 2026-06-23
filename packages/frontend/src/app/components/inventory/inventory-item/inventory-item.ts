import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HydratedItem } from '@tier5/bungie-api';

@Component({
  selector: 'app-inventory-item',
  imports: [
    CommonModule,
    DragDropModule,
  ],
  templateUrl: './inventory-item.html',
  styleUrl: './inventory-item.scss',
})
export class InventoryItem {

  @Input({ required: true }) item!: HydratedItem;
  @Input() isEquippedFrame = false;
}
