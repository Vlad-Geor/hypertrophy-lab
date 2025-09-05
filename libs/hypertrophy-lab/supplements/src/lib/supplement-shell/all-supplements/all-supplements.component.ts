import { httpResource } from '@angular/common/http';
import { Component, effect, inject, input } from '@angular/core';
import { StatefulIconComponent, TagComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';
import { API_BASE_URL } from '@ikigaidev/hl/shared';
import { PaginatorComponent } from '@ikigaidev/pagination';
import { SupplementListItemComponent } from './supplement-list-item/supplement-list-item.component';

@Component({
  selector: 'hl-all-supplements',
  templateUrl: './all-supplements.component.html',
  styleUrl: './all-supplements.component.scss',
  imports: [
    TagComponent,
    StatefulIconComponent,
    SupplementListItemComponent,
    PaginatorComponent,
    PaginatorComponent,
  ],
})
export class AllSupplementsComponent {
  private readonly API_BASE = inject(API_BASE_URL);

  supplements = input<Supplement[]>([
    { name: 'Vitamin C', itemCount: 90 },
    { name: 'Vitamin D', itemCount: 30 },
    { name: 'Creatine', itemCount: 60 },
  ]);

  suppData = httpResource<Supplement[]>(() => `${this.API_BASE}/supplements`);

  constructor() {
    effect(() => console.log(this.suppData.value()));
  }
}
