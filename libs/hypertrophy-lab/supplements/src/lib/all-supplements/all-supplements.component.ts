import { Component, input } from '@angular/core';
import { TagComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';
import { PaginatorComponent } from '@ikigaidev/pagination';
import { SupplementListItemComponent } from './supplement-list-item/supplement-list-item.component';

@Component({
  selector: 'hl-all-supplements',
  templateUrl: './all-supplements.component.html',
  styleUrl: './all-supplements.component.scss',
  imports: [
    TagComponent,
    SupplementListItemComponent,
    PaginatorComponent,
    PaginatorComponent,
  ],
})
export class AllSupplementsComponent {
  // TBD get from server - httpResource
  supplements = input<Supplement[]>([
    { name: 'Vitamin C', packageQuantity: 90 },
    { name: 'Vitamin D', packageQuantity: 30 },
    { name: 'Creatine', packageQuantity: 60 },
  ]);
}
