import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import {
  ButtonComponent,
  IconComponent,
  SearchComponent,
  SelectComponent,
} from '@ikigaidev/elements';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { AddSupplementComponent } from '../../add-supplement/add-supplement.component';

@Component({
  selector: 'hl-supplement-header',
  template: `
    <div
      class="px-6 pt-6 pb-4 flex flex-col gap-4 bg-surface border border-gray-soft rounded-lg shadow-xl"
    >
      <div class="flex items-start gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <lib-icon [icon]="'book-liner'" class="text-secondary"></lib-icon>
            <h1 class="text-heading-semibold text-white">
              {{ headerFor() | titlecase }}
            </h1>
          </div>
          <p class="text-sm text-nowrap font-semibold text-gray-text">
            5 of 5 supplements
          </p>
        </div>
        @if (headerFor() === 'inventory') {
          <lib-button [size]="'xl'" class="text-white" (click)="onAddInventoryItem()">
            <lib-icon [icon]="'plus-solid'" left [iconSize]="16"></lib-icon>
            Add
          </lib-button>
        }
      </div>

      <div class="flex flex-col gap-3">
        <lib-search></lib-search>
        <lib-select [options]="[]"></lib-select>
      </div>
    </div>
  `,
  host: {
    class: 'w-full',
  },
  imports: [
    SearchComponent,
    SelectComponent,
    ButtonComponent,
    IconComponent,
    TitleCasePipe,
  ],
})
export class SupplementHeaderComponent {
  private readonly overlay = inject(GlobalOverlay);

  headerFor = input.required<'inventory' | 'catalog'>();

  onAddInventoryItem(): void {
    this.overlay.openComponent(AddSupplementComponent, {
      overlayConfig: { hasBackdrop: true },
    });
  }
}
