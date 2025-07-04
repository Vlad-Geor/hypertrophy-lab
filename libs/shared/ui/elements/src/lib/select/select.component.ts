import { CommonModule } from '@angular/common';
import { Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'lib-select',
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  host: {
    '[class.minimal]': 'appearance() === "minimal"',
  },
})
export class SelectComponent {
  value = input<any>();
  _value = linkedSignal(() => this.value());
  appearance = input<'default' | 'minimal'>('default');
}
