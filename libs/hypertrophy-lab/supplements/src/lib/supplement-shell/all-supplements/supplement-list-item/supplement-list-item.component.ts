import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TagComponent, TagGroupComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';

@Component({
  selector: 'hl-supplement-list-item',
  templateUrl: './supplement-list-item.component.html',
  styleUrl: './supplement-list-item.component.scss',
  imports: [TagComponent, TagGroupComponent, TitleCasePipe],
})
export class SupplementListItemComponent {
  supplement = input<Supplement>();
}
