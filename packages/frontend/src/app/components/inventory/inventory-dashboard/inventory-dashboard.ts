import { Component, inject, signal } from '@angular/core';
import { HydratedItem } from '@tier5/bungie-api';
import { InventoryState } from '../../../services/inventory-state/inventory-state';
import { InventorySlot } from '../inventory-slot/inventory-slot';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-dashboard',
  imports: [
    CommonModule,
    DragDropModule,
    InventorySlot,
  ],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.scss',
})
export class InventoryDashboard {
  protected readonly store = inject(InventoryState);

  protected readonly slotsOrder = [
    'kinetic', 'energy', 'power',
    'helmet', 'gauntlets', 'chest', 'legs', 'classItem'
  ] as const;

  isSidekicksCollapsed = false;

  toggleCollapse() {
    this.isSidekicksCollapsed = !this.isSidekicksCollapsed;
  }

  shouldShow(i: number): boolean {
    if (i == 0) return true;
    return !this.isSidekicksCollapsed;
  }

  protected getVaultSlotItems(slotKey: string, vaultItems: HydratedItem[]): HydratedItem[] {
    return vaultItems.filter(item => item.slot === slotKey);
  }
}
