import { Component, effect, input, linkedSignal, signal } from '@angular/core';
import {
  AddedSupplementCard,
  AddedSupplementItem,
} from '../added-supplement-item/added-supplement-item.component';

@Component({
  selector: 'hl-added-supplements-overview',
  template: `
    @for (item of _data(); track $index) {
      <hl-added-supplement-item
        (supplementSelected)="selectedSupplement.set($event)"
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
  data = input.required<AddedSupplementCard[] | undefined>();
  _data = linkedSignal(() =>
    this.data()?.map((d) => ({
      ...d,
      name: d.name ?? '',
      images: d.images ?? [],
      bottleCount: 0,
      daysLeft:
        ((d.bottleCount ?? 1) * (d.unitsPerContainer ?? 0)) / Number(d.servingUnits),
    })),
  );
  selectedSupplement = signal<AddedSupplementCard | null>(null);

  constructor() {
    effect(() => console.log(this.selectedSupplement()));
  }
}
