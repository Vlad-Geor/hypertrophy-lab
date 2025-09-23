import { Component } from '@angular/core';
import { IconButtonComponent } from '../button/icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-date-range-picker',
  template: `
    <lib-icon-button [icon]="'chevron-left-solid-full'"></lib-icon-button>
    <p class="text-text-2 text-sm">Sep 8 - Sep 15, 2025</p>
    <lib-icon-button [icon]="'chevron-right-solid-full'"></lib-icon-button>
  `,
  imports: [IconComponent, IconButtonComponent],
  host: {
    class: 'flex items-center justify-between',
  },
})
export class DateRangePicker {}
