import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconType } from '@ikigaidev/model';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'lib-icon',
  imports: [CommonModule, MatIconModule, AngularSvgIconModule],
  template: `
    <svg-icon
      class="w-full flex items-center justify-center"
      [svgStyle]="{
        color: color(),
        width: iconSize(),
        height: iconSize(),
        fill: fillContainer() ? 'currentColor' : '',
        'stroke-width': strokeWidth() + 'px',
      }"
      [src]="'shared-assets/icons/' + icon() + '.svg'"
    ></svg-icon>
  `,
  host: {
    class: 'inline-flex rounded-md',
  },
  styles: `
    :host {
      &.color-on-hover {
        @apply hover:text-text-3;
      }
      &.highlight-on-hover {
        @apply hover:bg-gray-soft;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  icon = input.required<IconType | undefined>();
  color = input<string>('inherit');
  iconSize = input<number>(20);
  strokeWidth = input<number>(1);
  fillContainer = input(false);
  onHoverEffect = input<'highlight' | 'color'>('color');
}
