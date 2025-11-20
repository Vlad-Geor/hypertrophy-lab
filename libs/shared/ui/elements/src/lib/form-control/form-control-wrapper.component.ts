import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ErrorMessageComponent } from '../error/error-message.component';

@Component({
  selector: 'lib-form-control-wrapper',
  template: `
    @if (label()) {
      <span class="inline-block text-gray-text text-xs">{{ label() }}</span>
    }

    <ng-content></ng-content>

    @if (control() && control()?.dirty && !control()?.valid) {
      <lib-error-message [control]="control()"></lib-error-message>
    }
  `,
  imports: [ErrorMessageComponent],
  host: {
    class: 'flex flex-col gap-1.5',
  },
})
export class FormControlWrapperComponent {
  label = input<string | undefined>();
  errorMessage = input<string | undefined>();
  control = input<AbstractControl | null>(null);
}
