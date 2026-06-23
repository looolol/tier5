import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Backend } from 'src/app/services/backend/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { InventoryState } from 'src/app/services/inventory-state/inventory-state';


@Component({
  selector: 'app-inventory-page',
  imports: [CommonModule],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
})
export class InventoryPage {
  protected readonly store = inject(InventoryState);

  protected readonly weaponSlots = ['kinetic', 'energy', 'power'] as const;
  protected readonly armorSlots = ['helmet', 'gauntlets', 'chest', 'legs', 'classItem'] as const;
  protected readonly placeholderCount = Array(3).fill(0);

  protected getSlotLabel(slot: string): string {
    const labels: Record<string, string> = {
      kinetic: 'Kinetic Weapons',
      energy: 'Energy Weapons',
      power: 'Power Weapons',
      helmet: 'Helmets',
      gauntlets: 'Gauntlets',
      chest: 'Chest Armor',
      legs: 'Leg Armor',
      classItem: 'Class Items'
    };
    return labels[slot] || slot;
  }
}
