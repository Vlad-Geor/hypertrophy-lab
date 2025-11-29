import { Component, computed, inject } from '@angular/core';
import { BouncingLoaderComponent } from '@ikigaidev/elements';
import { SupplementCatalogItem } from '@ikigaidev/hl/contracts';
import { SupplementService } from '../../data-access/supplement.service';
import { SupplementStore } from '../../data-access/supplement.store';
import { SupplementListItemComponent } from './supplement-list-item/supplement-list-item.component';

@Component({
  selector: 'hl-all-supplements',
  templateUrl: './all-supplements.component.html',
  styleUrl: './all-supplements.component.scss',
  imports: [SupplementListItemComponent, BouncingLoaderComponent],
})
export class AllSupplementsComponent {
  readonly suppService = inject(SupplementService);
  readonly supplementStore = inject(SupplementStore);

  readonly allSupplementsIncludeUsers = this.suppService.allSupplements(true);
  readonly filteredSupplements = computed(() =>
    this.allSupplementsIncludeUsers.hasValue()
      ? this.allSupplementsIncludeUsers
          .value()
          .items.filter((v) =>
            v.name
              .toLowerCase()
              .startsWith(this.supplementStore.searchFilter().toLowerCase()),
          )
      : ([] as SupplementCatalogItem[]),
  );
}
