import { TitleCasePipe } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import {
  DividerComponent,
  DoughnutComponent,
  TagComponent,
  TagGroupComponent,
} from '@ikigaidev/elements';
import { SupplementCatalogItem } from '@ikigaidev/hl/contracts';
import { FirstWordPipe } from '@ikigaidev/pipe';

@Component({
  selector: 'hl-supplement-list-item',
  templateUrl: './supplement-list-item.component.html',
  styleUrl: './supplement-list-item.component.scss',
  imports: [
    TagComponent,
    FirstWordPipe,
    TagGroupComponent,
    TitleCasePipe,
    DoughnutComponent,
    DividerComponent,
  ],
})
export class SupplementListItemComponent {
  supplement = input<SupplementCatalogItem>();

  constructor() {
    effect(() => console.log(this.supplement()));
  }
}
