import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export type Orientation = 'vertical' | 'horizontal';

@Component({
  selector: 'lib-divider',
  imports: [CommonModule],
  templateUrl: './divider.component.html',
  host: {
    class: 'self-stretch flex items-center'
  }
})
export class DividerComponent {
  orientation = input<Orientation>('horizontal');
  heightPercentage = input<number>();
  type = input<'normal' | 'thick' | 'transparent'>('normal');
  marginBottom = input<'mb-0' | 'mb-2' | 'mb-4' | 'mb-8'>('mb-0');
}
