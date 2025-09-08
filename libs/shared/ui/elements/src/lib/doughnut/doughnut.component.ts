import { afterNextRender, Component, computed, input, linkedSignal } from '@angular/core';
import { Theme } from '@ikigaidev/model';

@Component({
  selector: 'lib-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss',
  host: {
    '[attr.data-tone]': 'theme()',
  },
})
export class DoughnutComponent {
  stroke = input<number>(16);
  progress = input.required<number>();
  sizePx = input<number>(248);
  theme = input<Theme>('secondary');

  CIRCLE_RADIUS = 90;
  CIRC = 2 * Math.PI * this.CIRCLE_RADIUS;

  squareLinecap = computed(() => (this.progress() === 100 ? true : false));
  offset = linkedSignal(() => -this.CIRC);
  _progress = computed(() =>
    this.progress() === 100 ? this.progress() : this.progress() - 2,
  );

  constructor() {
    afterNextRender({
      write: () => this.offset.set(-(this.CIRC * (1 - this._progress() / 100))),
    });
  }
}
