import { TitleCasePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import {
  ButtonComponent,
  IconComponent,
  InputComponent,
  SelectComponent,
  SelectOptionComponent,
} from '@ikigaidev/elements';
import { CellConfig } from '@ikigaidev/model';
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
        <lib-button [size]="'xl'" class="text-white" (click)="onAddInventoryItem()">
          <lib-icon [icon]="'plus-solid'" left [iconSize]="16"></lib-icon>
          Add
        </lib-button>
      </div>

      <div class="flex flex-col gap-3">
        <lib-input [withSearch]="true" placeholder="Search..."></lib-input>
        <lib-select [options]="options()" placeholder="All Categories"></lib-select>
      </div>
    </div>
  `,
  host: {
    class: 'w-full',
  },
  imports: [
    InputComponent,
    SelectComponent,
    ButtonComponent,
    IconComponent,
    TitleCasePipe,
    SelectOptionComponent,
  ],
})
export class SupplementHeaderComponent {
  private readonly overlay = inject(GlobalOverlay);

  readonly options = signal<CellConfig[]>([
    { displayText: 'A' },
    { displayText: 'B', icon: 'check-solid' },
    { displayText: 'C' },
  ]);

  headerFor = input.required<'inventory' | 'catalog'>();

  onAddInventoryItem(): void {
    this.overlay.openComponent(AddSupplementComponent, {
      overlayConfig: { hasBackdrop: true, backdropClass: 'bg-black/60' },
    });
  }
}
