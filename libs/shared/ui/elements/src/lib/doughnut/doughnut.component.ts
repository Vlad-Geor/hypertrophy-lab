import { afterNextRender, Component, computed, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'lib-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss',
})
export class DoughnutComponent {
  stroke = input<number>(16);
  CIRCLE_RADIUS = 90;
  CIRC = computed(() => 2 * Math.PI * this.CIRCLE_RADIUS);

  progress = input<number>();
  sizePx = input<number>(248);
  offset = linkedSignal(() => -this.CIRC());

  constructor() {
    afterNextRender({
      write: () => this.offset.set(-(this.CIRC() * (1 - (this.progress() ?? 0) / 100))),
    });
  }
}
