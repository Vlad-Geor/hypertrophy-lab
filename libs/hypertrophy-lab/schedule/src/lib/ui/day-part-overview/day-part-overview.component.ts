import { Component, effect, input } from '@angular/core';
import { DayFullEntrySchema } from '@ikigaidev/hl/contracts';
import { IntakeLogCard } from '../intake-log-card/intake-log-card.component';

@Component({
  selector: 'hl-day-part-overview',
  template: `
    <ng-content select="[dayPartOverviewHeader]"></ng-content>
    <ng-content></ng-content>
  `,
  imports: [IntakeLogCard],
  host: {
    class: 'py-4 px-3 flex flex-col gap-3 border border-gray-active rounded-xl',
  },
})
export class DayPartOverview {
  data = input<DayFullEntrySchema>();
}
