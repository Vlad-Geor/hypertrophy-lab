import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Size } from '@ikigaidev/model';

@Component({
  selector: 'lib-tag',
  imports: [CommonModule],
  template: `
    <ng-content></ng-content>
  `,
  styleUrl: './tag.component.scss',
  host: {
    '[class]': '[size(), brigtness()]',
  },
})
export class TagComponent {
  theme = input<'primary' | 'secondary' | 'accent'>('primary');
  brigtness = input<'dark' | 'default' | 'light'>('default');
  size = input<Extract<Size, 'xs' | 'sm' | 'md' | 'lg'>>('sm');
}
