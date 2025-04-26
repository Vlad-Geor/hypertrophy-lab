import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Size, ThemeColorToken, colorTokenMap } from '@ikigaidev/model';

@Component({
  selector: 'lib-tag',
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styles: `
    :host {
      color: var(--color-white);
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      max-height: var(--size-tag-max-height);
      width: fit-content;
    }
  `,
  host: {
    class: 'px-[6px]',
    '[class]': 'size() === "sm" ? "text-caption-semibold" : "text-caption-sm-semibold"',
    '[style.background-color]': 'colorTokenMap[bgColor()]',
  },
})
export class TagComponent {
  bgColor = input<ThemeColorToken>('primary.light.faded');
  size = input<Extract<Size, 'xs' | 'sm'>>('sm');
  colorTokenMap = colorTokenMap;
}
