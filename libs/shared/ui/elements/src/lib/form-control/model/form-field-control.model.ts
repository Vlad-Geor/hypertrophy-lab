import { InjectionToken, InputSignal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

export type InputTypeOption = 'text' | 'number' | 'email';

export interface FormFieldControl<T = any> {
  value: T | null | InputSignal<T>;

  readonly stateChanges?: Observable<void>;

  readonly id?: string | InputSignal<string>;

  readonly placeholder?: string | InputSignal<string>;

  readonly focused?: boolean | InputSignal<boolean>;

  readonly empty?: boolean | InputSignal<boolean>;

  readonly shouldLabelFloat?: boolean | InputSignal<boolean>;

  readonly disabled?: boolean | InputSignal<boolean>;

  readonly errorState?: boolean | InputSignal<boolean>;

  readonly controlType?: InputTypeOption | InputSignal<InputTypeOption>;

  readonly ngControl: NgControl | null;

  setDescribedByIds?(ids: string[]): void;

  onContainerClick?(event: MouseEvent): void;
}

export const FORM_FIELD_CONTROL = new InjectionToken<FormFieldControl>(
  'FORM_FIELD_CONTROL',
);
