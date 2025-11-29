import { Component, input } from '@angular/core';
import { IconComponent, IconTile, BouncingLoaderComponent } from '@ikigaidev/elements';
import { IconType, Theme } from '@ikigaidev/model';

@Component({
  selector: 'hl-dashboard-summary-card',
  templateUrl: './summary-card.component.html',
  host: {
    class:
      'relative overflow-hidden p-4 w-full flex items-start justify-between gap-4 border border-gray-active w-fit rounded-lg bg-surface shadow-lg',
  },
  imports: [IconTile, IconComponent, BouncingLoaderComponent],
})
export class SummaryCard {
  title = input.required<string>();
  value = input.required<number | string>();
  showAlert = input(false);
  theme = input.required<Theme>();
  icon = input.required<IconType>();
  loading = input<boolean>();
}
