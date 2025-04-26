import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Size } from '@ikigaidev/model';

export const carouselSizing: Record<
  Extract<Size, 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>,
  number
> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 56,
};

export type CarouselItem = {
  imageSrc: string;
  label: string;
};

@Component({
  selector: 'lib-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  host: {
    style: 'display: inline-flex; gap: 12px; border-radius: 999px;',
    '[style.height.px]': '_size()',
  },
})
export class CarouselComponent {
  size = input<Extract<Size, 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>>();
  _size = computed(() => carouselSizing[this.size() ?? 'lg']);

  items = input<CarouselItem[]>([]);
}
