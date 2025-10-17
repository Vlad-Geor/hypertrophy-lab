// hl-spinner.component.ts (Angular 17+)
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'lib-spinner',
  template: `
    <svg
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.--dur]="_duration() + 's'"
      viewBox="0 0 50 50"
      role="status"
      [attr.aria-label]="ariaLabel()"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        [attr.stroke-width]="stroke()"
        [attr.stroke]="color()"
      />
    </svg>
  `,
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  size = input(24);
  stroke = input(3);
  color = input<string>('white');
  duration = input(1400); // miliseconds
  _duration = computed(() => this.duration() / 1000);
  ariaLabel = input('Loading');
}
