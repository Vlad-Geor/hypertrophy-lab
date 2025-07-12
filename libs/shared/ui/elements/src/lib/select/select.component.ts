import { CommonModule } from '@angular/common';
import { Component, input, linkedSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'lib-select',
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  host: {
    '[class.minimal]': 'appearance() === "minimal"',
  },
})
export class SelectComponent {
  value = input<any>();
  options = input<any[]>();
  _value = linkedSignal(() => this.value());
  appearance = input<'default' | 'minimal'>('default');

  selectControl = new FormControl('');

  constructor() {
    // this.selectControl.valueChanges.subscribe(console.log);
  }
}
