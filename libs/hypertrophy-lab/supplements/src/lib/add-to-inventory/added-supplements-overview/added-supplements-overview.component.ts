import { Component, effect, input, linkedSignal, model, output } from '@angular/core';
import {
  AddedSupplementCard,
  AddedSupplementItem,
  SupplementStockChangeEvent,
} from '../added-supplement-item/added-supplement-item.component';

@Component({
  selector: 'hl-added-supplements-overview',
  template: `
    @for (item of data(); track $index) {
      <hl-added-supplement-item
        (supplementSelected)="selectedSupplement.set($event)"
        (stockChanged)="stockChanged.emit($event)"
        [selected]="selectedSupplement()?.id === item.id"
        [data]="item"
      ></hl-added-supplement-item>
    }
  `,
  host: {
    class: 'flex flex-col p-2 gap-1 bg-surface-2 rounded-md border border-gray-active',
  },
  imports: [AddedSupplementItem],
})
export class AddedSupplementsOverview {
  data = input.required<AddedSupplementCard[]>();
  // data = input.required<AddedSupplementCard[]>();
  selectedSupplement = linkedSignal<AddedSupplementCard | null>(
    () => this.data()?.[this.selectedSupplementIndex() ?? 0] ?? null,
  );
  selectedSupplementIndex = input<number>();
  supplementSelected = output<AddedSupplementCard>();
  stockChanged = output<SupplementStockChangeEvent>();

  constructor() {
    effect(() =>
      this.supplementSelected.emit(
        this.selectedSupplement() ?? ({} as AddedSupplementCard),
      ),
    );
  }
}
