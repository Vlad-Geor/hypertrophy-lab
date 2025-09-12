import { Directive, inject, input, linkedSignal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive()
export abstract class FormControlComponent<T> implements ControlValueAccessor {
  value = input<T>();
  _value = linkedSignal(() => this.value());
  placeholder = input<string>();
  label = input<string>();
  id = input<string>();
  focused = input<boolean>();
  disabled = input<boolean>();
  _disabled = linkedSignal(() => this.disabled());
  hasError = input<boolean>();
  uiLayerClass = input<'surface' | 'surface-1' | 'surface-2'>('surface-1');

  protected ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  get control() {
    return this.ngControl?.control ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onChange: (v: T | null | undefined) => void = () => {};

  protected onTouched!: () => void;

  abstract writeValue(value: T): void;
  abstract registerOnChange(fn: (value?: T | null) => void): void;
  abstract registerOnTouched(fn: () => void): void;
  abstract setDisabledState(isDisabled: boolean): void;

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input.value);

    this._value.set(input.value as T);
    this.onChange(this._value());
  }

  onBlur(): void {
    this.onTouched();
  }
}
