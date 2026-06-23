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

  private collapseMap = signal<Record<string, boolean>>({});

  protected isCollapsed(characterId: string): boolean {
    return !!this.collapseMap()[characterId];
  }

  protected toggleCollapse(characterId: string): void {
    this.collapseMap.update(map => ({
      ...map,
      [characterId]: !map[characterId]
    }));
  }

  protected getVaultSlotItems(slotKey: string, vaultItems: HydratedItem[]): HydratedItem[] {
    return vaultItems.filter(item => item.slot === slotKey);
  }
}
