import { Component } from '@angular/core';
import { addDays, format } from 'date-fns';
import { IconButtonComponent } from '../button/icon-button/icon-button.component';

@Component({
  selector: 'lib-date-range-picker',
  template: `
    <lib-icon-button
      class="text-gray pointer-events-none"
      [icon]="'chevron-left-solid-full'"
    ></lib-icon-button>
    <p class="text-text-2 text-sm">{{ range }}</p>
    <lib-icon-button
      class="text-gray pointer-events-none"
      [icon]="'chevron-right-solid-full'"
    ></lib-icon-button>
  `,
  imports: [IconButtonComponent],
  host: {
    class: 'flex items-center justify-between',
  },
})
export class DateRangePicker {
  start = new Date();
  end = addDays(this.start, 7);
  range = `${format(this.start, 'MMM d')} - ${format(this.end, 'MMM d, yyyy')}`;
}
