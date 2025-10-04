import { JsonPipe } from '@angular/common';
import { Component, computed, effect, input, linkedSignal, output } from '@angular/core';
import { ImagePlaceholderDirective } from '@ikigaidev/directive';
import { TagComponent } from '@ikigaidev/elements';
import { ExistingSuppItemData } from '../existing-supplement-item/existing-supplement-item.component';

export type AddedSupplementCard = ExistingSuppItemData & {
  bottleCount: number;
  daysLeft: number;
};

@Component({
  selector: 'hl-added-supplement-item',
  templateUrl: './added-supplement-item.component.html',
  imports: [JsonPipe, ImagePlaceholderDirective, TagComponent],
  host: {
    '(click)': 'supplementSelected.emit(_data())',
    class:
      'flex flex-1 items-center p-2 gap-4 rounded hover:cursor-pointer hover:bg-bg-light',
    '[class.bg-bg-light]': 'selected()',
  },
  styles: `
    .stock-action-btn {
      @apply transition-all duration-100 ease-in-out rounded-full flex items-center justify-center text-lg bg-primary-soft text-text-2 border border-primary-soft h-8 w-8 hover:bg-primary-ring;
    }
  `,
})
export class AddedSupplementItem {
  data = input.required<AddedSupplementCard | undefined>();
  _data = linkedSignal<AddedSupplementCard>(() => ({
    ...this.data(),
    id: this.data()?.id ?? '',
    name: this.data()?.name ?? '',
    images: this.data()?.images ?? [],
    bottleCount: 1,
    daysLeft: 1,
  }));

  selected = input(false);
  supplementSelected = output<AddedSupplementCard>();

  stockDaysLeft = computed(() => {
    const d = this._data();
    const bottles = d?.bottleCount;
    if (bottles) {
      return (bottles * (d.unitsPerContainer ?? 0)) / (d.servingUnits ?? 1);
    } else return 0;
  });

  constructor() {
    effect(() => console.log(this.data()));
    // effect(() => console.log(this._data()));
  }

  increaseBottleStock(): void {
    this._data.update((d) => ({ ...d, bottleCount: d.bottleCount + 1 }));
  }

  decreaseBottleStock(): void {
    this._data.update((d) => ({
      ...d,
      bottleCount: d.bottleCount > 0 ? d.bottleCount - 1 : d.bottleCount,
    }));
  }
}
