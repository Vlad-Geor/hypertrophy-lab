import { CommonModule } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlComponent } from '../form-control/form-control.component';
import { IconComponent } from '../icon/icon.component';

type InputType = string | number;
@Component({
  selector: 'lib-input',
  imports: [CommonModule, IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  host: {
    style: 'border:none; display: inline-flex; align-items:center; gap:8px; padding: 0;',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent<
  T extends InputType = string,
> extends FormControlComponent<T> {
  transparent = input<boolean>();
  type = input<T>();
  withSearch = input<boolean>(false);
  rounded = input<boolean>(false);

  override writeValue(value: T): void {
    if (value) {
      this._value.set(value);
    }
  }
  override registerOnChange(fn: (value?: T | null) => void): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  override setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
