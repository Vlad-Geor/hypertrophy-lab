import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthTargetCarouselComponent } from '@ikigaidev/carousel';
import { InputComponent } from '@ikigaidev/elements';
import { HealthTarget, HealthTargetCarouselItem, healthTargets } from '@ikigaidev/model';
import { NavigationComponent } from '@ikigaidev/navigation';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hl-feature-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    InputComponent,
    NavigationComponent,
    HealthTargetCarouselComponent,
  ],
  templateUrl: './feature-shell.component.html',
  styleUrl: './feature-shell.component.scss',
  host: {
    style: 'display:flex; justify-content: center;',
  },
})
export class FeatureShellComponent {
  healthTargets: HealthTarget[] = [...healthTargets];

  carouselData = this.healthTargets.map(
    (t, i) => ({ index: i, target: t }) as HealthTargetCarouselItem,
  );
}
