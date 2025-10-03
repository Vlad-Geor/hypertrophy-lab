import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormControlWrapperComponent } from '../form-control/form-control-wrapper.component';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'lib-slide-toggle',
  imports: [CommonModule, FormControlWrapperComponent],
  templateUrl: './slide-toggle.component.html',
})
export class SlideToggleComponent extends FormControlComponent<boolean> {
  isActive = signal(false);

  toggleSlide() {
    this.isActive.update((active) => !active);
  }

  constructor() {
    super();
    effect(() => {
      this.writeValue(this.isActive());
      this.onChange(this.isActive());
    });
  }

  override writeValue(value: boolean): void {
    if (value) {
      this._value.set(value);
    }
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
