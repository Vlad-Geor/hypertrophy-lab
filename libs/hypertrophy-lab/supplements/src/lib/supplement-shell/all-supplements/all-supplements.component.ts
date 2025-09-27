import { httpResource } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PageMeta } from '@ikigaidev/contracts';
import { BouncingLoaderComponent, InifinityLoaderComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';
import { API_BASE_URL, ListCatalogResponse } from '@ikigaidev/hl/shared';
import { delay } from 'rxjs';
import { SupplementListItemComponent } from './supplement-list-item/supplement-list-item.component';

export type PaginatedDataResponse<T> = { items: T[]; page: PageMeta };

@Component({
  selector: 'hl-all-supplements',
  templateUrl: './all-supplements.component.html',
  styleUrl: './all-supplements.component.scss',
  imports: [
    SupplementListItemComponent,
    InifinityLoaderComponent,
    BouncingLoaderComponent,
  ],
})
export class AllSupplementsComponent {
  private readonly API_BASE = inject(API_BASE_URL);

  supplements = input<Supplement[]>([
    { name: 'Vitamin C', itemCount: 90 },
    { name: 'Vitamin D', itemCount: 30 },
    { name: 'Creatine', itemCount: 60 },
  ]);

  suppData = httpResource<ListCatalogResponse>(
    () => `${this.API_BASE}/supplements?includeUser=true`,
  );
}
