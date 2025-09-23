import { Component, input, signal } from '@angular/core';
import { ButtonComponent, IconComponent, IconTile, TagComponent, IconButtonComponent } from '@ikigaidev/elements';

@Component({
  selector: 'hl-intake-action-card',
  templateUrl: './intake-log-card.component.html',
  imports: [IconTile, TagComponent, ButtonComponent, IconComponent, IconButtonComponent],
  host: {
    class: 'flex flex-col gap-3 bg-surface-2 p-3 pb-4 rounded-lg',
  },
})
export class IntakeLogCard {
  logState = input<'taken' | 'skipped' | null>('taken');
}
