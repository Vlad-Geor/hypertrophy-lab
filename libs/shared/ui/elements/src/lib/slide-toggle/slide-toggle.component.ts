import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'lib-slide-toggle',
  imports: [CommonModule],
  templateUrl: './slide-toggle.component.html',
  host: {
    class: 'flex items-center gap-2',
  },
  styles: `
    @keyframes fade-in {
      100% {
        opacity: 100%;
      }
      0% {
        opacity: 0%;
      }
    }
    @keyframes fade-out {
      100% {
        opacity: 0%;
      }
      0% {
        opacity: 100%;
      }
    }
  `,
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
