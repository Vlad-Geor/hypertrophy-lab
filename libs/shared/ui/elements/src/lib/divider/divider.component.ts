import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export type Orientation = 'vertical' | 'horizontal';

@Component({
  selector: 'lib-divider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divider.component.html',
})
export class DividerComponent {
  orientation = input<Orientation>('vertical');
  type = input<'normal' | 'thick' | 'transparent'>('normal');
  marginBottom = input<'mb-0' | 'mb-2' | 'mb-4' | 'mb-8'>('mb-0');
}
