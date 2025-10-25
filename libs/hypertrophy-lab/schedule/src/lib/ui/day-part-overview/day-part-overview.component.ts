import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DayFullEntrySchema } from '@ikigaidev/hl/contracts';

@Component({
  selector: 'hl-day-part-overview',
  template: `
    <ng-content select="[dayPartOverviewHeader]"></ng-content>
    <ng-content></ng-content>
  `,
  host: {
    class: 'py-4 px-3 flex flex-col gap-3 border border-gray-active rounded-xl',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayPartOverview {
  data = input<DayFullEntrySchema>();
}
