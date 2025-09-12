import { Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

type MsgFn = (e: any, c: AbstractControl) => string;

const DEFAULT: Record<string, MsgFn> = {
  required: () => 'Required',
  email: () => 'Invalid email',
  minlength: (e) => `Min ${e.requiredLength} characters`,
  maxlength: (e) => `Max ${e.requiredLength} characters`,
  min: (e) => `Min ${e.min}`,
  max: (e) => `Max ${e.max}`,
  pattern: () => 'Invalid format',
};

@Component({
  selector: 'lib-error-message',
  template: `
    @if (text()) {
      <lib-icon [icon]="'alert-circle-liner'" [iconSize]="12"></lib-icon>
      <p>{{ text() }}</p>
    }
  `,
  imports: [IconComponent],
  host: {
    class: '@apply flex items-center gap-1 text-danger text-xxs pl-1 leading-normal',
  },
})
export class ErrorMessageComponent {
  control = input<AbstractControl | null>(null);
  messages = input<Partial<Record<string, MsgFn>>>({});

  text = computed(() => {
    const c = this.control();
    if (!c || !(c.touched || c.dirty) || !c.errors) return '';
    const key = Object.keys(c.errors)[0]!;
    const fn = this.messages()[key] ?? DEFAULT[key];
    return fn ? fn((c.errors as any)[key], c) : '';
  });
}
