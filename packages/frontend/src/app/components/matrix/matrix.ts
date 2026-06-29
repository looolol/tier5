import { Component, computed, inject } from '@angular/core';
import { HydratedItem } from '@tier5/bungie-api';
import { CommonModule } from '@angular/common';
import { InventoryState } from '../../services/inventory-state/inventory-state';


interface ArchetypeRow {
  frameName: string;
  elementsMap: Map<string, HydratedItem[]>;
}

interface WeaponTypeSection {
  typeName: string;
  trackedElements: string[];
  archetypeRows: ArchetypeRow[];
}


@Component({
  selector: 'app-matrix',
  imports: [
    CommonModule,
  ],
  templateUrl: './matrix.html',
  styleUrl: './matrix.scss',
})
export class Matrix {
  protected readonly store = inject(InventoryState);

  protected readonly columnsElements = [
    'Kinetic', 'Stasis', 'Strand', 'Arc', 'Solar', 'Void'
  ] as const;

  protected readonly atlasData = computed<WeaponTypeSection[]>(() => {
   if (!this.store.characters() && !this.store.vault()) return [];

    const allWeapons: HydratedItem[] = [];

    this.store.characters().forEach(char => {
      Object.values(char.slots).forEach(slotItems => {
        allWeapons.push(
          ...slotItems.filter((item: { bucketType: string }) => item.bucketType === 'weapon'),
        );
      });
    });
    allWeapons.push(...this.store.vault().filter(item => item.bucketType === 'weapon'));

    const typeMap = new Map<string, Map<string, Map<string, HydratedItem[]>>>();

    allWeapons.forEach(item => {
      const type = item.weaponType || item.itemType || 'UnknownType';
      const element = item.element || 'Kinetic';
      const frame = item.frame || 'General / Exotic';

      if (!typeMap.has(type)) typeMap.set(type, new Map());
      const archetypeMap = typeMap.get(type)!;

      if (!archetypeMap.has(frame)) archetypeMap.set(frame, new Map());
      const elementMap = archetypeMap.get(frame)!;

      if (!elementMap.has(element)) elementMap.set(element, []);
      elementMap.get(element)!.push(item);
    });

    const finalSections: WeaponTypeSection[] = [];
    typeMap.forEach((archetypeMap, typeName) => {
      const archetypeRows: ArchetypeRow[] = [];

      archetypeMap.forEach((elementMap, frameName) => {
        archetypeRows.push({
          frameName,
          elementsMap: elementMap
        });
      });

      archetypeRows.sort((a, b) => a.frameName.localeCompare(b.frameName));

      finalSections.push({
        typeName,
        trackedElements: [...this.columnsElements],
        archetypeRows
      });
    });

    return finalSections.sort((a, b) => a.typeName.localeCompare(b.typeName));
  });
}
