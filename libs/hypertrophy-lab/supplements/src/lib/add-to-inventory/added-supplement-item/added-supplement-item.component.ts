import { Component, computed, input, output } from '@angular/core';
import { ImagePlaceholderDirective } from '@ikigaidev/directive';
import { TagComponent } from '@ikigaidev/elements';
import { ExistingSuppItemData } from '../existing-supplement-dropdown-item/existing-supplement-item.component';

export type AddedSupplementCard = ExistingSuppItemData & {
  bottleCount: number;
  daysLeft: number;
};

export type SupplementStockChangeEvent = { catalogId: string; newStock: number };

@Component({
  selector: 'hl-added-supplement-item',
  templateUrl: './added-supplement-item.component.html',
  imports: [ImagePlaceholderDirective, TagComponent],
  host: {
    '(click)': 'supplementSelected.emit(data())',
    class:
      'flex flex-1 items-center p-2 gap-4 rounded hover:cursor-pointer hover:bg-bg-light',
    '[class.bg-bg-light]': 'selected()',
  },
})
export class AddedSupplementItem {
  data = input.required<AddedSupplementCard>();

  selected = input(false);
  supplementSelected = output<AddedSupplementCard>();
  stockChanged = output<SupplementStockChangeEvent>();

  stockDaysLeft = computed(() => {
    const d = this.data();
    const bottles = d?.bottleCount;
    return bottles ? (bottles * (d.unitsPerContainer ?? 0)) / (d.servingUnits ?? 1) : 0;
  });

  increaseBottleStock(): void {
    const d = this.data();
    this.stockChanged.emit({
      catalogId: d.id ?? '',
      newStock: (d.bottleCount ?? 1) + 1,
    });
  }

  decreaseBottleStock(): void {
    const d = this.data();
    this.stockChanged.emit({
      catalogId: d.id ?? '',
      newStock: (d.bottleCount ?? 0) > 0 ? d.bottleCount - 1 : d.bottleCount,
    });
  }
}
