import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControlWrapperComponent } from '../form-control/form-control-wrapper.component';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'lib-textarea',
  imports: [CommonModule, FormControlWrapperComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent extends FormControlComponent<string> {
  override writeValue(value: string): void {
    this._value.set(value);
  }
  override registerOnChange(fn: (value?: string | null | undefined) => void): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  override setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this._value.set(val);
    this.onChange(val);
  }
}
