import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputComponent } from '@ikigaidev/elements';
import { HeaderComponent } from '@ikigaidev/header';
import { HealthTarget, HealthTargetCarouselItem, healthTargets } from '@ikigaidev/model';
import { NavigationComponent } from '@ikigaidev/navigation';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hl-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    InputComponent,
    HeaderComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  host: {
    style: 'display:flex; justify-content: center;',
  },
})
export class ShellComponent {
  healthTargets: HealthTarget[] = [...healthTargets];

  carouselData = this.healthTargets.map(
    (t, i) => ({ index: i, target: t }) as HealthTargetCarouselItem,
  );
}
