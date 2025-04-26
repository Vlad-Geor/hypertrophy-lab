import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { GlobalOverlayDirective } from '@ikigaidev/directive';
import { IconComponent } from '@ikigaidev/elements';
import {
  CarouselComponent,
  CarouselItem,
} from '../../../../../shared/ui/carousel/src/lib/carousel/carousel.component';
import { supplements } from '../../../../mock/src/lib/const/supplement.mock';
import { AddSupplementComponent } from '../add-supplement/add-supplement.component';
import { SupplementCardComponent } from '../supplement-card/supplement-card.component';

export const API_URL = 'https://api.example.com/supplements';

@Component({
  selector: 'hl-supplement-list',
  imports: [CommonModule, SupplementCardComponent, IconComponent, CarouselComponent],
  templateUrl: './supplement-list.component.html',
  styleUrl: './supplement-list.component.scss',
  host: {
    style: 'display:inline-flex; flex-direction: column',
  },
  providers: [GlobalOverlayDirective],
})
export class SupplementListComponent {
  private readonly globalOverlay = inject(GlobalOverlayDirective);
  categories: CarouselItem[] = [
    { imageSrc: '', label: 'Energy' },
    { imageSrc: '', label: 'General' },
    { imageSrc: '', label: 'Hypertrophy' },
    { imageSrc: '', label: 'Immune' },
    { imageSrc: '', label: 'Memory' },
    { imageSrc: '', label: 'Cognitive' },
    { imageSrc: '', label: 'Heart' },
  ];

  // if our endpoint was an external api, or a server
  // private supplemetResource = httpResource<Supplement[]>(API_URL);

  readonly clientSupplements = rxResource({
    loader: () => supplements,
  });

  constructor() {}

  addSupp(): void {
    this.globalOverlay.open(AddSupplementComponent);
  }
}
