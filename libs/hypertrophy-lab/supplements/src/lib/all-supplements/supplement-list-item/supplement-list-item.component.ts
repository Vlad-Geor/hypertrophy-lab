import { Component, input } from '@angular/core';
import { TagComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';

@Component({
  selector: 'hl-supplement-list-item',
  templateUrl: './supplement-list-item.component.html',
  styleUrl: './supplement-list-item.component.scss',
  imports: [TagComponent],
})
export class SupplementListItemComponent {
  supplement = input<Supplement>();
}
