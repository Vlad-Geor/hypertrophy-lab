import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { CarouselComponent } from '@ikigaidev/carousel';
import { GlobalOverlayDirective } from '@ikigaidev/directive';
import { ButtonComponent, IconComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';
import { categories, supplements } from '@ikigaidev/mock';
import { API_BASE_URL } from '@ikigaidev/shared';
import { AddSupplementComponent } from '../add-supplement/add-supplement.component';
import { SupplementCardComponent } from '../supplement-card/supplement-card.component';

@Component({
  selector: 'hl-user-supplements',
  imports: [
    CommonModule,
    SupplementCardComponent,
    IconComponent,
    CarouselComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './user-supplements.component.html',
  styleUrl: './user-supplements.component.scss',
  host: {
    style: 'display:inline-flex; flex-direction: column',
  },
  providers: [GlobalOverlayDirective],
})
export class SupplementListComponent {
  private readonly globalOverlay = inject(GlobalOverlayDirective);
  private readonly API_BASE = inject(API_BASE_URL);

  supplements = httpResource<Supplement[]>(`${this.API_BASE}/supplement`);

  categories = categories;

  // if our endpoint was an external api, or a server
  // private supplemetResource = httpResource<Supplement[]>(API_URL);

  readonly clientSupplements = rxResource({
    loader: () => supplements,
  });

  addSupp(): void {
    this.globalOverlay.open(AddSupplementComponent, [], {});
  }

  goToApi(): void {
    console.log('nada');
  }
}
