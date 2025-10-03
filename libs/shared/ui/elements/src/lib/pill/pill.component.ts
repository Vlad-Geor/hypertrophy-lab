import { Component, input, output } from '@angular/core';
import { Daypart } from '@ikigaidev/hl/shared';

@Component({
  selector: 'lib-pill',
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: `flex justify-center items-center gap-2 text-xs font-medium w-full py-1 border border-gray rounded-2xl hover:border-secondary-ring hover:cursor-pointer transition-all duration-75 ease-in-out`,
    '[class.bg-surface-2]': 'selected()',
    '[class.border-secondary-ring]': 'selected()',
    '(click)': 'onSelfClick()',
  },
})
export class Pill {
  daypart = input.required<Daypart>();
  selected = input<boolean>(false);
  pillSelected = output<Daypart>();

  onSelfClick(): void {
    this.pillSelected.emit(this.daypart());
  }
}
