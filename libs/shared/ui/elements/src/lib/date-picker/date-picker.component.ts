import { Component } from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { IconButtonComponent } from '../button/icon-button/icon-button.component';
import { FormControlWrapperComponent } from '../form-control/form-control-wrapper.component';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'lib-date-picker',
  template: `
    <lib-form-control-wrapper [label]="label()">
      <div
        class="bg-surface-2 border border-gray-ring rounded-md flex items-center gap-2"
      >
        <input
          [placeholder]="placeholder() ?? 'e.g 1/1/2025'"
          class="bg-transparent text-text-2 border-none outline-none focus:outline-none focus:ring-0 placeholder:text-sm"
          matInput
          [matDatepicker]="picker"
          (dateChange)="onDateChange($event)"
        />
        <lib-icon-button
          [inheritIconFillColor]="false"
          [onHoverEffect]="'color'"
          class="text-text-2"
          [icon]="'calendar-liner'"
          (click)="picker.open()"
        ></lib-icon-button>
        <mat-datepicker #picker></mat-datepicker>
      </div>
    </lib-form-control-wrapper>
  `,
  imports: [MatDatepickerModule, IconButtonComponent, FormControlWrapperComponent],
})
export class DatePickerComponent extends FormControlComponent<Date | null> {
  onDateChange($event: MatDatepickerInputEvent<Date | null>): void {
    this.writeValue($event.value);
    this.onChange($event.value);
  }

  override writeValue(value: Date | null): void {
    if (value) {
      this._value.set(value);
    }
  }

  override registerOnChange(fn: (value?: Date | null) => void): void {
    this.onChange = fn;
  }

  override registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  override setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
