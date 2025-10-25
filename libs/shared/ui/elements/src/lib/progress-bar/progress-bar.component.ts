import { Component, computed, input } from '@angular/core';
import { Theme } from '@ikigaidev/model';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'lib-progress-bar',
  templateUrl: './progress-bar.component.html',
  host: {
    class: 'block',
  },
  imports: [CommonModule],
})
export class Progressbar {
  value = input.required<number>();
  max = input.required<number>();
  widthPx = input();
  showLabel = input(true);
  theme = input<Theme>('primary');

  pct = computed(() => {
    const m = this.max() || 1;
    return Math.max(0, Math.min(100, (this.value() / m) * 100));
  });
}
