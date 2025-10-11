import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Size } from '@ikigaidev/model';
import { FormControlComponent } from '../form-control/form-control.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-checkbox',
  templateUrl: './checkbox.component.html',
  imports: [CommonModule, IconComponent],
  host: {
    class: 'flex items-center gap-1',
  },
})
export class Checkbox<T> extends FormControlComponent<boolean> {
  size = input<Extract<Size, 'sm' | 'md'>>('md');

  override writeValue(value: boolean): void {
    this._value.set(!!value);
  }
  override registerOnChange(fn: (value: boolean | undefined | null) => void): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  override setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  toggleCheckbox(): void {
    if (this._disabled()) return;
    this._value.update((v) => !v);
    this.onChange(this._value());
    this.onTouched();
  }
}
