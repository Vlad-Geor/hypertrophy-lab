import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ImagePlaceholderDirective } from '@ikigaidev/directive';
import {
  DividerComponent,
  DoughnutComponent,
  TagComponent,
  TagGroupComponent,
} from '@ikigaidev/elements';
import { SupplementCatalogItem } from '@ikigaidev/hl/contracts';
import { Theme } from '@ikigaidev/model';
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
  stockLeftPercentage = computed(() =>
    Math.min(
      ((this._supplement()?.onHand ?? 0) / (this._supplement()?.unitsPerContainer ?? 0)) *
        100,
      100,
    ),
  );

  doughnutThemeColors = computed<Theme>(() => {
    const percentageLeft = this.stockLeftPercentage();
    if (percentageLeft >= 75) {
      return 'success';
    } else if (percentageLeft > 50 && percentageLeft < 75) {
      return 'secondary';
    } else if (percentageLeft > 25 && percentageLeft <= 50) {
      return 'warning';
    } else {
      return 'danger';
    }
  });
}
