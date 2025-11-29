import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ImagePlaceholderDirective } from '@ikigaidev/directive';
import {
  BouncingLoaderComponent,
  ButtonComponent,
  TagComponent,
  TagGroupComponent,
} from '@ikigaidev/elements';
import { InventoryItemSummary } from '@ikigaidev/hl/contracts';
import { ViewportService } from '@ikigaidev/layout-service';

@Component({
  selector: 'hl-supplement-card',
  imports: [
    CommonModule,
    TagComponent,
    ButtonComponent,
    TagGroupComponent,
    BouncingLoaderComponent,
    ImagePlaceholderDirective,
  ],
  templateUrl: './supplement-card.component.html',
  styles: `
    :host {
      @apply flex p-1 pr-2 gap-2 md:gap-3 bg-surface-2 rounded-md border border-gray-soft h-28;
    }
  `,
})
export class SupplementCardComponent {
  readonly viewportService = inject(ViewportService);

  supplement = input<InventoryItemSummary>();
  remainingDays = computed(
    () =>
      Math.round(this.supplement()?.onHand ?? 0) / (this.supplement()?.servingUnits ?? 0),
  );
}
