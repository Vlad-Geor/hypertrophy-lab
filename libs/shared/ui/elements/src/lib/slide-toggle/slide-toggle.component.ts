import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControlWrapperComponent } from '../form-control/form-control-wrapper.component';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'lib-slide-toggle',
  imports: [CommonModule, FormControlWrapperComponent],
  templateUrl: './slide-toggle.component.html',
})
export class SlideToggleComponent extends FormControlComponent<boolean> {
  isActive = signal(false);

  // onChange = (v: boolean | null | undefined) => {};
  // private onTouched = () => {};

  toggleSlide() {
    if (this.disabled()) return;
    const v = !this.isActive();
    this.isActive.set(v);
    this._value.set(v);
    this.onChange(v);
    this.onTouched();
  }

  override writeValue(value: boolean | null): void {
    const val = !!value;
    this.isActive.set(val);
    this._value.set(val);
  }
  override registerOnChange(fn: (value?: boolean | null) => void): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  override setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
