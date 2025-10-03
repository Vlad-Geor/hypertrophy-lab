import { Component, inject } from '@angular/core';
import { BouncingLoaderComponent } from '@ikigaidev/elements';
import { SupplementService } from '../../data-access/supplement.service';
import { SupplementListItemComponent } from './supplement-list-item/supplement-list-item.component';

@Component({
  selector: 'hl-all-supplements',
  templateUrl: './all-supplements.component.html',
  styleUrl: './all-supplements.component.scss',
  imports: [SupplementListItemComponent, BouncingLoaderComponent],
})
export class AllSupplementsComponent {
  readonly suppService = inject(SupplementService);

  readonly allSupplementsIncludeUsers = this.suppService.allSupplements(true);
}
