import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Size } from '@ikigaidev/model';

export type NoDataType = 'filter' | 'no-data';

@Component({
  selector: 'hl-no-data',
  template: `
    <div class="flex items-center justify-center">
      <img
        class="brightness-125"
        [ngClass]="[size() === 'md' ? 'max-w-28' : 'max-w-40']"
        [src]="
          type() === 'filter'
            ? '/assets/images/hl-no-search-results.png'
            : '/assets/images/hl-no-data-circle.png'
        "
        alt="HL-no-data-image"
      />
      @if (type() === 'filter') {
        <div class="flex flex-col gap-1">
          <p
            class="font-medium"
            [ngClass]="{ 'text-2xl mb-1': size() === 'lg', 'text-lg': size() === 'md' }"
          >
            That's a miss.
          </p>
          <p
            class="text-gray-text"
            [ngClass]="{ 'text-xs': size() === 'md', 'text-sm': size() === 'lg' }"
          >
            Please try a different query / filter.
          </p>
        </div>
      } @else {
        <div class="flex flex-col gap-1">
          <p
            class="font-medium"
            [ngClass]="{ 'text-2xl mb-1': size() === 'lg', 'text-lg': size() === 'md' }"
          >
            {{ noDataTitle() ?? 'Nothing to see here.' }}
          </p>
          <p
            class="text-gray-text"
            [ngClass]="{ 'text-xs': size() === 'md', 'text-sm': size() === 'lg' }"
          >
            {{ noDataMessage() ?? 'This page is currently empty. Please try again.' }}
          </p>
        </div>
      }
    </div>
  `,
  host: {
    class: 'rounded-lg bg-surface-2 py-1 px-4',
  },
  imports: [NgClass],
})
export class NoData {
  type = input.required<NoDataType>();
  noDataMessage = input<string>();
  noDataTitle = input<string>();
  size = input<Extract<Size, 'md' | 'lg'>>('lg');

  // font-size : 18px, margin bottom: 0,
}
