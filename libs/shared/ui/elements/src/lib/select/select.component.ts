import { CommonModule } from '@angular/common';
import { Component, input, linkedSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-select',
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent <T> {
  value = input<T>();
  options = input.required<T[]>();
  appearance = input<'default' | 'minimal'>('default');
  placeholder = input('');
  _value = linkedSignal(() => this.value());
  

  constructor() {
    // this.selectControl.valueChanges.subscribe(console.log);
  }
}
