import { Component, input } from '@angular/core';
import { TagComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';
import { SupplementListItemComponent } from './supplement-list-item/supplement-list-item.component';

@Component({
  selector: 'hl-all-supplements',
  templateUrl: './all-supplements.component.html',
  styleUrl: './all-supplements.component.scss',
  imports: [TagComponent, SupplementListItemComponent],
})
export class AllSupplementsComponent {
  // TBD get from server - httpResource
  supplements = input<Supplement[]>([
    { name: 'Vitamin C' },
    { name: 'Vitamin D' },
    { name: 'Creatine' },
  ]);
}
