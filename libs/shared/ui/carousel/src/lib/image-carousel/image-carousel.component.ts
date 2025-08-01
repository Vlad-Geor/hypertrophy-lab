import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { HealthTargetItemComponent } from '@ikigaidev/hl/ui';
import { CarouselItem, HealthTarget, Size } from '@ikigaidev/model';

export const carouselSizing: Record<Extract<Size, 'sm' | 'md' | 'lg' | 'xl'>, number> = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

@Component({
  selector: 'lib-image-carousel',
  standalone: true,
  imports: [CommonModule, HealthTargetItemComponent],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
  host: {
    class: 'flex gap-2',
  },
})
export class ImageCarouselComponent {
  size = input<Extract<Size, 'sm' | 'md' | 'lg' | 'xl'>>('md');
  _size = computed(() => carouselSizing[this.size()]);

  items = input<CarouselItem[]>([]);

  healthTargets: HealthTarget[] = [
    'arteries',
    'brain',
    'digestion',
    'energy',
    'veins',
    'relaxation',
    'immune',
  ];
}
