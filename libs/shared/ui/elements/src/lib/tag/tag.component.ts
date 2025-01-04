import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'lib-tag',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styles: `
    :host {
      background-color: var(--color-primary-light);
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
export class TagComponent {}
