import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BouncingLoaderComponent,
  ButtonComponent,
  IconComponent,
} from '@ikigaidev/elements';
import { categories } from '@ikigaidev/hl/mock';
import { ErrorPage } from '@ikigaidev/hl/shared';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { AddSupplementToInventory } from '../../add-to-inventory/add-to-inventory.component';
import { SupplementStore } from '../../data-access/supplement.store';
import { SupplementCardComponent } from '../../supplement-card/supplement-card.component';

@Component({
  selector: 'hl-user-supplements',
  imports: [
    CommonModule,
    SupplementCardComponent,
    ReactiveFormsModule,
    BouncingLoaderComponent,
    ErrorPage,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './user-supplements.component.html',
  styleUrl: './user-supplements.component.scss',
})
export class SupplementList {
  private readonly globalOverlay = inject(GlobalOverlay);
  readonly store = inject(SupplementStore);

  categories = categories;

  onAddInventoryItem(): void {
    this.globalOverlay.openComponent(AddSupplementToInventory, {
      overlayConfig: { hasBackdrop: true, backdropClass: 'bg-black/60' },
    });
  }

  constructor() {
    effect(() => console.log(this.store.userSupplementCount()));
  }
}
