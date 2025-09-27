import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormControlWrapperComponent } from '../form-control/form-control-wrapper.component';
import { FormControlComponent } from '../form-control/form-control.component';
import { IconComponent } from '../icon/icon.component';

type InputType = string | number;

@Component({
  selector: 'lib-input',
  imports: [CommonModule, IconComponent, FormControlWrapperComponent],
  templateUrl: './input.component.html',
  host: {
    class: 'bg-transparent border-none p-0 flex-1',
  },
})
export class InputComponent<
  T extends InputType = string,
> extends FormControlComponent<T> {
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
