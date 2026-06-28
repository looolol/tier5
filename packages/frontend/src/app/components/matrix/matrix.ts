import { Component, computed, inject } from '@angular/core';
import { HydratedItem } from '@tier5/bungie-api';
import { CommonModule } from '@angular/common';
import { InventoryState } from '../../services/inventory-state/inventory-state';

interface AtlasCell {
  frame: string;
  weapons: HydratedItem[];
}

interface ElementRow {
  elementName: string;
  framesMap: Map<string, HydratedItem[]>;
}

interface WeaponTypeSection {
  typeName: string;
  allDiscoveredFrames: string[];
  elements: ElementRow[];
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

  protected readonly trackedElements = [
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
      const elementMap = typeMap.get(type)!;

      if (!elementMap.has(element)) elementMap.set(element, new Map());
      const frameMap = elementMap.get(element)!;

      if (!frameMap.has(frame)) frameMap.set(frame, []);
      frameMap.get(frame)!.push(item);
    });

    const finalSections: WeaponTypeSection[] = [];
    typeMap.forEach((elementMap, typeName) => {
      const frameSet = new Set<string>();
      elementMap.forEach(frameMap => {
        frameMap.forEach((_, frameName) => frameSet.add(frameName));
      });
      const allDiscoveredFrames = Array.from(frameSet).sort();

      const elements: ElementRow[] = this.trackedElements.map(elementName => {
        const framesMap = elementMap.get(elementName) || new Map<string, HydratedItem[]>();
        return { elementName, framesMap };
      });

      finalSections.push({
        typeName,
        allDiscoveredFrames,
        elements
      });
    });

    return finalSections.sort((a, b) => a.typeName.localeCompare(b.typeName));
  });
}
