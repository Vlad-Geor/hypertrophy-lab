import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Size } from '@ikigaidev/model';
import { SurfaceCard } from '../surface-card/surface-card.component';

@Component({
  selector: 'lib-bouncing-loader',
  template: `
    <!-- <lib-surface-card> -->
    <div class="loader">
      @for (circle of circleAmountFilledArr(); track $index) {
        <span
          [ngClass]="{ 'min-h-4 w-4': size() === 'sm', 'min-h-6 w-6': size() === 'md' }"
        ></span>
      }
    </div>
    <span class="loading text-center">Loading...</span>
    <!-- </lib-surface-card> -->
  `,
  styleUrl: './bouncing-loader.component.scss',
  imports: [SurfaceCard, CommonModule],
})
export class BouncingLoaderComponent {
  size = input<Size>('md');
  circleAmount = input<number>(3);
  circleAmountFilledArr = computed(() => Array(this.circleAmount()).fill({}));
}
