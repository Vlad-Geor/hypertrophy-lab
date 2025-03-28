import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ThemeColor } from '@ikigaidev/model';

@Component({
  selector: 'lib-tag',
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styles: `
    :host {
      background-color: var(--color-primary);
      color: var(--color-white);
      padding-inline: 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 400;
      display: flex;
      align-items: center;
      max-height: var(--size-tag-max-height);
    }
  `,
})
export class TagComponent {
bgColor = input<ThemeColor>();
}
