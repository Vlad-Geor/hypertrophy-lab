import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { IconComponent } from '@ikigaidev/elements';
import { supplements } from '../../../../mock/src/lib/const/supplement.mock';
import { SupplementCardComponent } from '../supplement-card/supplement-card.component';

export const API_URL = 'https://api.example.com/supplements';

@Component({
  selector: 'hl-supplement-list',
  imports: [CommonModule, SupplementCardComponent, IconComponent],
  templateUrl: './supplement-list.component.html',
  styleUrl: './supplement-list.component.scss',
  host: {
    class: 'p-4 flex flex-col',
  },
})
export class SupplementListComponent {
  // if our endpoint was an external api, or a server
  // private supplemetResource = httpResource<Supplement[]>(API_URL);

  readonly clientSupplements = rxResource({
    loader: () => supplements,
  });

  constructor() {
    console.log(this.clientSupplements);
    console.log(this.clientSupplements.value);
    console.log(this.clientSupplements.value());
  }

  // }
  // suppelements: Supplement[] = [...supplementData];
}
