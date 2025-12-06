import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ImagePlaceholderDirective } from '@ikigaidev/directive';
import { ButtonComponent, TagComponent } from '@ikigaidev/elements';
import { Target } from '@ikigaidev/hl/contracts';
import { ViewportService } from '@ikigaidev/layout-service';

export type UserSupplementOverview = {
  onHand: number;
  servingUnits: number;
  images: string[];
  catalogName: string;
  brandName: string;
  targets: Target[];
  supplementBatchTrackingMode: 'personal' | 'shared';
  groupName?: string;
};

@Component({
  selector: 'hl-supplement-card',
  imports: [CommonModule, TagComponent, ButtonComponent, ImagePlaceholderDirective],
  templateUrl: './supplement-card.component.html',
  styles: `
    :host {
      @apply flex p-1 pr-2 gap-2 md:gap-3 bg-surface-2 rounded-md border border-gray-soft h-28 relative;
    }
  `,
})
export class SupplementCardComponent {
  readonly viewportService = inject(ViewportService);

  // supplement = input<InventoryItemSummary>();
  supplement = input<UserSupplementOverview>();

  remainingDays = computed(
    () =>
      Math.round(this.supplement()?.onHand ?? 0) / (this.supplement()?.servingUnits ?? 0),
  );
}
