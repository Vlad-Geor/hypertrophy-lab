import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ImagePlaceholderDirective } from '@ikigaidev/directive';
import {
  DividerComponent,
  DoughnutComponent,
  TagComponent,
  TagGroupComponent,
} from '@ikigaidev/elements';
import { SupplementCatalogItem } from '@ikigaidev/hl/contracts';
import { FirstWordPipe } from '@ikigaidev/pipe';
import { map } from 'rxjs';

@Component({
  selector: 'hl-supplement-list-item',
  templateUrl: './supplement-list-item.component.html',
  styleUrl: './supplement-list-item.component.scss',
  imports: [
    TagComponent,
    FirstWordPipe,
    TagGroupComponent,
    TitleCasePipe,
    JsonPipe,
    DoughnutComponent,
    DividerComponent,
    ImagePlaceholderDirective,
  ],
})
export class SupplementListItemComponent {
  supplement = input<SupplementCatalogItem>();
  _supplement = toSignal(
    toObservable(this.supplement).pipe(
      map((s) => ({ ...s, servingUnits: Number(s?.servingUnits) })),
    ),
  );
  stockLeftPercentage = computed(
    () =>
      ((this._supplement()?.onHand ?? 0) / (this._supplement()?.unitsPerContainer ?? 0)) *
      100,
  );
}
