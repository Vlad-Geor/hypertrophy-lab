import { httpResource } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { PageMeta } from '@ikigaidev/contracts';
import { InifinityLoaderComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';
import { API_BASE_URL } from '@ikigaidev/hl/shared';
import { SupplementListItemComponent } from './supplement-list-item/supplement-list-item.component';

export type PaginatedDataResponse<T> = { items: T[]; page: PageMeta };

@Component({
  selector: 'hl-all-supplements',
  templateUrl: './all-supplements.component.html',
  styleUrl: './all-supplements.component.scss',
  imports: [SupplementListItemComponent, InifinityLoaderComponent],
})
export class AllSupplementsComponent {
  private readonly API_BASE = inject(API_BASE_URL);

  supplements = input<Supplement[]>([
    { name: 'Vitamin C', itemCount: 90 },
    { name: 'Vitamin D', itemCount: 30 },
    { name: 'Creatine', itemCount: 60 },
  ]);

  suppData = httpResource<PaginatedDataResponse<Supplement>>(
    () => `${this.API_BASE}/supplements`,
  );
}
