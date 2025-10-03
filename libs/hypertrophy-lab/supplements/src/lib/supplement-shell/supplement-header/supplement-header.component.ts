import { TitleCasePipe } from '@angular/common';
import { Component, inject, input, linkedSignal, signal } from '@angular/core';
import {
  ButtonComponent,
  generateUnitOptions,
  IconComponent,
  InputComponent,
  MultiSelectComponent,
  SingleSelectComponent,
  stableCellId,
} from '@ikigaidev/elements';
import { ListItem } from '@ikigaidev/model';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { AddSupplementToInventory } from '../../add-to-inventory/add-to-inventory.component';
import {
  ExistingSuppItemData,
  ExistingSupplementItem,
} from '../../add-to-inventory/existing-supplement-item/existing-supplement-item.component';

export type DemiType = {
  valOne: string;
  valTwo: number;
};

@Component({
  selector: 'hl-supplement-header',
  template: `
    <div
      class="px-6 pt-6 pb-4 flex flex-col gap-4 bg-surface border border-gray-soft rounded-lg shadow-xl"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <lib-icon [icon]="'book-liner'" class="text-secondary"></lib-icon>
            <h1 class="text-heading-semibold text-white">
              {{ headerFor() | titlecase }}
            </h1>
          </div>
          <lib-multi-select [items]="unitOptions()"></lib-multi-select>
          <!-- <p class="text-sm text-nowrap font-semibold text-gray-text">
            5 of 5 supplements
          </p> -->
        </div>
        <lib-button
          theme="gradient-primary"
          [size]="'lg'"
          class="text-white"
          (click)="onAddInventoryItem()"
        >
          <lib-icon [icon]="'plus-solid'" left [iconSize]="16"></lib-icon>
          Add
        </lib-button>
      </div>

      <div class="flex flex-col gap-3">
        <lib-input [withSearch]="true" placeholder="Search..."></lib-input>
        <lib-single-select
          [options]="_options()"
          [value]="_options()[0]"
          placeholder="All Categories"
          [listItemRenderComponent]="existingSuppComponentType"
        ></lib-single-select>
      </div>
    </div>
  `,
  host: {
    class: 'w-full',
  },
  imports: [
    InputComponent,
    SingleSelectComponent,
    ButtonComponent,
    IconComponent,
    TitleCasePipe,
    MultiSelectComponent,
  ],
})
export class SupplementHeaderComponent {
  private readonly overlay = inject(GlobalOverlay);

  existingSuppComponentType = ExistingSupplementItem;

  unitOptions = signal(
    generateUnitOptions(30).map((op, i) => ({
      ...op,
      data: { valOne: 'Blabla' + ` ${i}`, valTwo: 22 + i } as DemiType,
      id: stableCellId(`${op.displayText}|${op.data}`),
    })),
  );

  readonly _options = linkedSignal(() =>
    this.options().map((opt) => ({
      ...opt,
      id: stableCellId(`${opt.displayText}|${opt.data}`),
    })),
  );

  readonly options = signal<ListItem<ExistingSuppItemData>[]>([
    { displayText: 'A', data: { images: ['val three'], name: 'Name 1' } },
    {
      displayText: 'B',
      icon: 'check-solid',
      data: { images: ['val three'], name: 'Name 1' },
    },
    { displayText: 'C', data: { images: ['val three'], name: 'Name 1' } },
  ]);

  headerFor = input.required<'inventory' | 'catalog'>();

  onAddInventoryItem(): void {
    this.overlay.openComponent(AddSupplementToInventory, {
      overlayConfig: { hasBackdrop: true, backdropClass: 'bg-black/60' },
    });
  }
}
